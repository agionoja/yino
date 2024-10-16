import {
  getDiscriminatorModelForClass,
  getModelForClass,
  modelOptions,
  pre,
  prop,
} from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import { User } from "~/models/user.model";
import { Chat, GroupChatClass, SingleChatClass } from "~/models/chat.model";
import { Schema } from "mongoose";
import { GroupClass } from "~/models/group.model";
import { CHAT_TYPES } from "~/types";

@pre<Conversation>("find", function () {
  this.populate({
    path: "sender",
    select: "name photo",
  });
})
@modelOptions({
  schemaOptions: { collection: "conversations", timestamps: true },
})
export class Conversation {
  @prop({ required: true, ref: () => User, type: () => User })
  public sender!: Ref<User>;

  @prop({
    required: true,
    type: () => Chat,
    ref: () => SingleChatClass,
  })
  public lastMessage!: Ref<SingleChatClass>;
}

@pre<GroupConversation>("find", function () {
  this.populate({
    path: "group",
    select: "name photo",
  });

  this.populate("lastMessage");
})
export class GroupConversation extends Conversation {
  @prop({
    required: true,
    ref: GroupClass,
    type: () => Schema.Types.ObjectId,
    index: 1,
  })
  group!: Ref<GroupClass>;

  @prop({
    required: true,
    type: () => Chat,
    ref: () => GroupChatClass,
  })
  public declare lastMessage: Ref<SingleChatClass>;
}

const ConversationModel = getModelForClass(Conversation);

export const GroupConversationModel = getDiscriminatorModelForClass(
  ConversationModel,
  GroupConversation,
  CHAT_TYPES.GROUP,
);

export default ConversationModel;
