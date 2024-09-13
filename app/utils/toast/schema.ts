import { z } from "zod";
import { TypeOptions } from "react-toastify";

export const toastMessageSchema = z.object({
  text: z.string(),
  type: z.custom<TypeOptions>(),
});

export type ToastMessage = z.infer<typeof toastMessageSchema>;

export const flashSessionValuesSchema = z.object({
  toast: toastMessageSchema.optional(),
});

export type FlashSessionValue = z.infer<typeof flashSessionValuesSchema>;
