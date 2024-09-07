import { Model, model, Schema, Types } from "mongoose";

type Delete =
  | {
      isDeleted: boolean;
      forEveryone: true;
    }
  | {
      isDeleted: boolean;
      forOnlyMe: true;
    };

export interface IChat {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  message: string;
  isReceived: boolean;
  delete: Delete;
  isRead: boolean;
}

type ChatModel = Model<IChat>;

const chatSchema = new Schema<IChat, ChatModel>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      required: [true, "A chat must have a sender"],
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: [true, "A chat must have a receiver"],
    },
    message: {
      type: String,
      required: [true, "A chat must have a message"],
    },
    isReceived: Boolean,
    isRead: Boolean,
  },
  { timestamps: true },
);

const Chat = model<IChat, ChatModel>("chat", chatSchema);

export default Chat;
