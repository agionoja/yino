import { modelOptions, prop } from "@typegoose/typegoose";
import type { AppFile } from "~/types";
import FileClass from "~/models/schamas/file.schema";

export enum MESSAGE_TYPES {
  AUDIO = "audio",
  TEXT = "text",
  DOCUMENT = "document",
}

@modelOptions({
  schemaOptions: {
    discriminatorKey: "messageType",
    _id: false,
  },
})
export class MessageBase {
  @prop({
    required: true,
    enum: MESSAGE_TYPES,
    type: () => String,
  })
  public type!: MESSAGE_TYPES;
}

export class TextMessage extends MessageBase {
  @prop({
    required: true,
    type: () => String,
  })
  public text!: string;
}

export class AudioMessage extends MessageBase {
  @prop({
    required: true,
    type: () => FileClass,
  })
  public audio!: AppFile;
}

export class DocumentMessage extends MessageBase {
  @prop({
    required: true,
    type: () => FileClass,
  })
  public text!: AppFile;
}
