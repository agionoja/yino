import { model, Schema } from "mongoose";

const groupSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    name: {
      type: String,
      required: [true, "A group name is required"],
    },
  },
  { timestamps: true },
);

groupSchema.virtual("messages", {
  ref: "Message",
  foreignField: "group",
  localField: "_id",
});

const Group = model("Group", groupSchema);

export default Group;
