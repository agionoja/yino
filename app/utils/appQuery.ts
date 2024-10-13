import { QueryWithHelpers } from "mongoose";
import { AllClassesProps, QueryObject } from "~/types";
import { AppError } from "~/utils/app.error";

export default class AppQuery<T> {
  private readonly queryObject: QueryObject;
  private query: QueryWithHelpers<T[], T>;

  constructor(queryObject: typeof this.queryObject, query: typeof this.query) {
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
  }

  public paginate() {
    const limit = this.queryObject.paginate?.limit || 10;
    const page = this.queryObject.paginate?.page || 1;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  public search() {
    const search = this.queryObject.search;

    if (!search) {
      throw new AppError("The search string must", 400);
    }

    const searchQuery = Object.keys(search).map((field) => ({
      [field as keyof AllClassesProps]: {
        $regex: search[field as keyof AllClassesProps],
        $options: "i",
      },
    })) as any[];

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
