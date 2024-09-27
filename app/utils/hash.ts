import { createHash } from "node:crypto";

export function createHashSha256(payload: string) {
  return createHash("sha256").update(payload).digest("hex");
}
