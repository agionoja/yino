import { Schema } from "mongoose";
import type { Ref } from "@typegoose/typegoose";
import {
  getDiscriminatorModelForClass,
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import { User } from "~/models/user.model";
import { GroupClass } from "~/models/group.model";
import { CHAT_TYPES } from "~/types";

@modelOptions({
  schemaOptions: {
    collection: "chats",
    timestamps: true,
  },
})
export class Chat {
  @prop({
    type: Schema.Types.ObjectId,
    ref: () => User,
    required: true,
    index: 1,
  })
  public sender!: Ref<User>;

  @prop({
    required: true,
    type: () => String,
  })
  public message!: string;

  @prop({ type: () => Boolean })
  public isDelivered?: boolean;

  @prop({ type: () => Boolean })
  public isReceived?: boolean;

  @prop({ type: () => Boolean })
  public isRead?: boolean;
}

export class GroupChatClass extends Chat {
  @prop({
    type: Schema.Types.ObjectId,
    required: true,
    ref: () => GroupClass,
    index: 1,
  })
  group!: Ref<GroupClass>;
}

export class SingleChatClass extends Chat {
  @prop({
    type: Schema.Types.ObjectId,
    ref: () => User,
    required: true,
    index: 1,
  })
  public receiver!: Ref<User>;
}

const ChatModel = getModelForClass(Chat);

export const SingleChatModel = getDiscriminatorModelForClass(
  ChatModel,
  SingleChatClass,
  CHAT_TYPES.SINGLE,
);

export const GroupChatModel = getDiscriminatorModelForClass(
  ChatModel,
  GroupChatClass,
  CHAT_TYPES.GROUP,
);

export default ChatModel;
