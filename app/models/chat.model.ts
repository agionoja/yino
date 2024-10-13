import { Schema } from "mongoose";
import type { Ref } from "@typegoose/typegoose";
import {
  getDiscriminatorModelForClass,
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import { UserClass } from "~/models/user.model";
import { ConversationClass } from "~/models/conversation.model";
import {
  AudioMessage,
  DocumentMessage,
  MESSAGE_TYPES,
  MessageBase,
  TextMessage,
} from "~/models/schamas/message.schema";
import { GroupClass } from "~/models/group.model";

const enum CHAT_TYPES {
  SINGLE = "single",
  GROUP = "group",
}

@modelOptions({
  schemaOptions: {
    collection: "chats",
    timestamps: true,
  },
})
export class ChatBase {
  @prop({
    type: Schema.Types.ObjectId,
    ref: () => UserClass,
    required: [true, "A chat must have a sender"],
  })
  public sender!: Ref<UserClass>;

  @prop({
    type: Schema.Types.ObjectId,
    ref: () => UserClass,
    required: [true, "A chat must have a conversation"],
  })
  public conversation!: Ref<ConversationClass>;

  @prop({
    required: true,
    type: MessageBase,
    discriminators: () => [
      { type: TextMessage, value: MESSAGE_TYPES.TEXT },
      { type: AudioMessage, value: MESSAGE_TYPES.AUDIO },
      { type: DocumentMessage, value: MESSAGE_TYPES.DOCUMENT },
    ],
  })
  public message!: MessageBase;

  @prop({ type: () => Boolean })
  public isDelivered?: boolean;

  @prop({ type: () => Boolean })
  public isReceived?: boolean;

  @prop({ type: () => Boolean })
  public isRead?: boolean;
}

class GroupChatClass extends ChatBase {
  @prop({ type: Schema.Types.ObjectId, required: true, ref: () => GroupClass })
  group!: Ref<GroupClass>;
}

class SingleChatClass extends ChatBase {
  @prop({ type: Schema.Types.ObjectId, ref: () => UserClass, required: true })
  public receiver!: Ref<UserClass>;
}

const Chat = getModelForClass(ChatBase);

export const SingleChat = getDiscriminatorModelForClass(
  Chat,
  SingleChatClass,
  CHAT_TYPES.SINGLE,
);

export const GroupChat = getDiscriminatorModelForClass(
  Chat,
  GroupChatClass,
  CHAT_TYPES.GROUP,
);

// const chat = await GroupChat.create({
//   group: "6702b4db2ed86f9b8e4115df",
//   sender: "6702b4db2ed86f9b8e4815df",
//   conversation: "6702b4db2ed86f9b8e4815df",
//   receiver: "6702b4db2ed86f9b8e4854df",
//   message: {
//     type: "audio",
//     audio: {
//       url: "https://localhost:8080",
//       publicId: "khkfhelkfjdakl",
//     },
//   } as AudioMessage,
// });
//
// console.log(chat);

export default Chat;
