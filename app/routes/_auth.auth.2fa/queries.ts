import asyncOperationHandler from "~/utils/async.operation";
import UserModel from "~/models/user.model";
import { AppError } from "~/utils/app.error";
import { Types } from "mongoose";
import { createHashSha256 } from "~/utils/hash";
import Email from "~/utils/email";
import { logDevInfo } from "~/utils/dev.console";

export function validateOtp(otp: FormDataEntryValue | undefined) {
  return asyncOperationHandler(async () => {
    if (!otp) {
      throw new AppError("Otp is required to authenticate your login", 401);
    }

    const user = await UserModel.findOne({
      otp: createHashSha256(String(otp)),
      otpExpires: { $gt: new Date() },
    }).exec();

    if (!user) {
      throw new AppError("OTP is invalid or has expired", 401);
    }

    await user.destroyOtpAndSave();
    return user;
  });
}

export function resendOtp(_id?: Types.ObjectId) {
  return asyncOperationHandler(async () => {
    const user = await UserModel.findById(_id).select("_id").exec();

    if (user) {
      const otp = await user.generateAndSaveOtp();
      logDevInfo({ otp });
      await new Email(user).sendOtp(otp);
    }
  });
}
