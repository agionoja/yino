import { createHash } from "node:crypto";
import asyncOperationHandler from "~/utils/async.operation";
import User from "~/models/user.model";
import { AppError } from "~/utils/app.error";

export function validateOtp(otp: FormDataEntryValue | null) {
  return asyncOperationHandler(async () => {
    if (!otp) {
      throw new AppError("Otp is required to authenticate your login", 401);
    }

    const user = await User.findOne({
      otp: createHash("sha256").update(String(otp)).digest("hex"),
      otpExpires: { $gt: new Date() },
    }).exec();

    if (!user) {
      throw new AppError("Otp is invalid or has expired", 401);
    }

    return user;
  });
}
