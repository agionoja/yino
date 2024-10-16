import { QueryWithHelpers } from "mongoose";
import { QueryObject } from "~/types";
import { AppError } from "~/utils/app.error";
import UserModel from "~/models/user.model";

type Paginate = { paginate: { page: number; limit: number } };
type Query<T> = QueryWithHelpers<T[], T>;
type AppQueryArgs<T> = { queryObject: QueryObject<T>; query: Query<T> };
type AppQueryWithPaginationArgs<T> = {
  queryObject: QueryObject<T> & Paginate;
  query: Query<T>;
};

export default class AppQuery<T> {
  protected readonly queryObject: QueryObject<T>;
  protected query: Query<T>;

  constructor({ queryObject, query }: AppQueryArgs<T>) {
    this.queryObject = queryObject;
    this.query = query;
  }

  public filter() {
    const excludedFields = ["sort", "limit", "fields", "page"] as const;
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
    const defaultExcludedFields = ["__t", "__v"];
    if (this.queryObject.fields) {
      const excludedFields = [
        this.queryObject.fields,
        ...defaultExcludedFields,
      ].join(" ");

      this.query = this.query.select(excludedFields);
    } else {
      this.query = this.query.select(defaultExcludedFields.join(" "));
    }

    return this;
  }

  public search() {
    const search = this.queryObject.search;

    if (!search) {
      throw new AppError("The search string must", 400);
    }

    const searchQuery = Object.keys(search).map((field) => ({
      $regex: search[field],
      $options: "i",
    }));

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
  constructor({ queryObject, query }: AppQueryWithPaginationArgs<T>) {
    super({ queryObject, query });
  }

  public async getDocumentMetaData() {
    const documentCount = await this.query.countDocuments();
    return {
      documentCount,
      pageCount: Math.ceil(documentCount / this.queryObject.paginate.limit),
    };
  }

  public paginate() {
    const limit = this.queryObject.paginate?.limit || 10;
    const page = this.queryObject.paginate?.page || 1;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const users = await new AppQueryWithPagination({
  query: UserModel.find(),
  queryObject: {
    paginate: { page: 1, limit: 10 },
    sort: ["-verificationToken", "-_id"],
    search: { name: "divine" },
    fields: ["+email", "role"],
  },
})
  .lean()
  .exec();
