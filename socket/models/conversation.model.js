import { Schema, model } from "mongoose";

const conversationSchema = new Schema({}, { timestamps: true });

const Conversation = model("Conversation", conversationSchema);

export default Conversation;
