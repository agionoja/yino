import jwt from "~/utils/jwt";
import User from "~/models/user.model";
import Email from "~/utils/email";
import asyncOperationHandler from "~/utils/async.operation";
import { AppError } from "~/utils/app.error";
import { logDevInfo } from "~/utils/dev.console";

export function sendVerification(token: string | undefined, baseUrl: string) {
  return asyncOperationHandler(async () => {
    const decoded = await jwt.verify(String(token));
    const user = await User.findById(decoded._id)
      .select("_id name email role isVerified")
      .exec();

    if (user?.isVerified) {
      throw new AppError("You are already verified", 409, "isVerified");
    }

    if (user) {
      const verificationCode =
        await user.generateAndSaveToken("verificationToken");
      const verificationUrl = `${baseUrl}/auth/verify/${verificationCode}`;

      logDevInfo({ baseUrl: baseUrl });

      try {
        await new Email(user).sendVerification(verificationUrl);
        return user;
      } catch (e) {
        // logDevError({ devErrSendVerification: e });
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save({ validateBeforeSave: false });
        throw e;
      }
    }
  });
}
