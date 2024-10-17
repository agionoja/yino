import { QueryWithHelpers } from "mongoose";
import { QueryObject } from "~/types";
import { AppError } from "~/utils/app.error";

type Paginate = { paginate: { page: number; limit: number } };
type Query<T> = QueryWithHelpers<T[], T>;
type AppQueryArgs<T> = { queryObject: QueryObject<T>; query: Query<T> };
type AppQueryWithPaginationArgs<T> = {
  queryObject: QueryObject<T> & Paginate;
  query: Query<T>;
};

type Control = {
  page: number;
  limit: number;
};

type MetaData = {
  next: null | Control;
  previous: null | Control;
  documentCount: number | null;
  pageCount: number | null;
};

export default class AppQuery<T> {
  protected readonly queryObject: QueryObject<T>;
  protected query: Query<T>;

  constructor({ queryObject, query }: AppQueryArgs<T>) {
    this.queryObject = queryObject;
    this.query = query;
  }

  public filter() {
    const excludedFields = ["sort", "fields", "paginate", "search"] as const;
    const copied = { ...this.queryObject };

    excludedFields.forEach((el) => delete copied[el]);

    const queryStr = JSON.stringify(copied).replace(
      /\b(gte|gt|lte|lt|in|ne|eq|regex|options|text|search)\b/g,
      (match) => `$${match}`,
    );

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  public sort() {
    if (this.queryObject.sort) {
      const sortBy = this.queryObject.sort.join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  public limitFields() {
    if (this.queryObject.fields) {
      const excludedFields = [this.queryObject.fields].join(" ");

      this.query = this.query.select(excludedFields);
    } else {
      this.query = this.query.select(["-__t", "-__v"].join(" "));
    }

    return this;
  }

  public search() {
    const search = this.queryObject.search;

    if (!search) {
      throw new AppError("The search string must", 400);
    }

    const searchQuery: any[] = Object.keys(search).map((field) => ({
      [field]: {
        $regex: search[field],
        $options: "i",
      },
    }));

    console.log(searchQuery);

    this.query = this.query.find({ $or: searchQuery });

    return this;
  }

  public lean() {
    return this.query.lean();
  }

  public async exec() {
    return await this.query.exec();
  }
}

export class AppQueryWithPagination<T> extends AppQuery<T> {
  protected declare queryObject: AppQueryWithPaginationArgs<T>["queryObject"];
  public readonly metaData!: MetaData; // Define metadata as a class property

  constructor({ queryObject, query }: AppQueryWithPaginationArgs<T>) {
    super({ queryObject, query });
    this.metaData = {
      next: null,
      previous: null,
      pageCount: null,
      documentCount: null,
    };
  }

  private async getDocumentMetaData() {
    const copiedQuery = this.query.clone();

    const documentCount = await copiedQuery.countDocuments();
    const { limit, page } = this.queryObject.paginate;
    const pageCount = Math.ceil(documentCount / limit);

    // Set metadata
    if (pageCount > page) {
      this.metaData.next = {
        page: page + 1,
        limit,
      };
    }

    if (page > 1 && pageCount >= page) {
      this.metaData.previous = {
        page: page - 1,
        limit,
      };
    }

    this.metaData.documentCount = documentCount;
    this.metaData.pageCount = pageCount;

    return this.metaData;
  }

  public async paginate() {
    await this.getDocumentMetaData();

    const { limit, page } = this.queryObject.paginate;

    this.query = this.query.skip((page - 1) * limit).limit(limit);

    return this;
  }
}
