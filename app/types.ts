import {
  GoogleUserClass,
  RegularUserClass,
  roles,
  UserClass,
} from "~/models/user.model";
import FileClass from "~/models/schamas/file.schema";
import { Types } from "mongoose";
import { Filter } from "mongodb";
import { GroupClass } from "~/models/group.model";

export type Role = (typeof roles)[number];
export type ClassProperties<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

export type UserType = ClassProperties<UserClass> & { _id: Types.ObjectId };

export type AppFile = ClassProperties<FileClass>;

type Fields = keyof AllClassesProps;
type Combination = `${"+" | ""}${Fields}`[] | `${"-"}${Fields}`[];

export type AllClassesProps = Partial<ClassProperties<RegularUserClass>> &
  Partial<ClassProperties<GoogleUserClass>> &
  Partial<ClassProperties<GroupClass>>;

export type QueryObject = {
  fields?: Combination;
  sort?: Combination;
  _id?: Types.ObjectId;
  search?: AllClassesProps;
  paginate?: { page: number; limit: number };
  __t?: string;
} & Filter<AllClassesProps>;
