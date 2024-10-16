import type { Ref } from "@typegoose/typegoose";
import { prop } from "@typegoose/typegoose";
import { User } from "~/models/user.model";

export class GroupClass {
  @prop({ required: true })
  name!: string;

  @prop({
    required: true,
    ref: () => User,
    validate: {
      validator: (value: User[]) => value.length < 50,
    },
  })
  public members!: Ref<User>[];
}
