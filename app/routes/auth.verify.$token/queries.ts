import asyncOperationHandler from "~/utils/async.operation";
import User from "~/models/user.model";
import { createHashSha256 } from "~/utils/hash";
import { AppError } from "~/utils/app.error";

export function verify(token: string | undefined) {
  return asyncOperationHandler(async () => {
    const user = await User.findOne({
      verificationToken: createHashSha256(String(token)),
      verificationTokenExpires: { $gte: new Date() },
    })
      .select("_id role")
      .exec();

    if (!user) {
      throw new AppError("Verification token is invalid or has expired", 401);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return user;
  });
}
