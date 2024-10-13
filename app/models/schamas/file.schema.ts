import { prop } from "@typegoose/typegoose";

export default class FileClass {
  @prop({ required: true, type: () => String })
  public publicId!: string;

  @prop({ required: true, type: () => String })
  public url!: string;
}
