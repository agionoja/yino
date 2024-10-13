import type { Ref } from "@typegoose/typegoose";
import { prop } from "@typegoose/typegoose";
import { UserClass } from "~/models/user.model";

export class GroupClass {
  @prop({
    required: true,
    ref: () => UserClass,
    validate: {
      validator: (value: UserClass[]) => value.length < 50,
    },
  })
  public members!: Ref<UserClass>[];
}
