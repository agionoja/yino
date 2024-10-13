import { getModelForClass, prop } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import { UserClass } from "~/models/user.model";
import { ChatBase } from "~/models/chat.model";
import { Schema } from "mongoose";

export class ConversationClass {
  @prop({ ref: "UserClass", type: () => Schema.Types.ObjectId })
  public participants!: Ref<UserClass>[];

  @prop({
    ref: "ChatClass",
    foreignField: () => "conversation",
    localField: () => "_id",
  })
  public chats?: Ref<ChatBase>[];

  @prop({
    required: [true, "The last message is required"],
    type: () => ChatBase,
  })
  lastMessage!: ChatBase;
}

const Conversation = getModelForClass(ConversationClass, {
  schemaOptions: {
    collection: "conversations",
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
});

export default Conversation;
