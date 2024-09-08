import { Schema } from "mongoose";

export interface IPhoto {
  id: string;
  url: string;
}

const photoSchema = new Schema<IPhoto>({
  id: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

export default photoSchema;
