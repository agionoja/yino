import { Schema, model } from "mongoose";

export const messageSchema = new Schema(
  {
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    messages: {
      type: String,
      required: ["Message is required"],
    },
    isDelivered: Boolean,
    isRead: Boolean,
    isDeleted: Boolean,
  },
  { timestamps: true },
);

messageSchema.pre(/^find/, function (next) {
  this.populate({ path: "sender", select: "name" }).populate({
    path: "receiver",
    select: "name",
  });
  next();
});

const Message = model("Message", messageSchema);

export default Message;
