import { AppError } from "~/utils/app.error";
import User from "~/models/user.model";
import asyncOperationHandler from "~/utils/async.operation";

export async function resetPassword(
  formData: { [k: string]: FormDataEntryValue },
  passwordResetToken: string,
) {
  return asyncOperationHandler(async () => {
    const { password, passwordConfirm } = formData;

    if (!password || passwordConfirm) {
      throw new AppError(
        "New password and password confirmation are required",
        400,
      );
    }

    const user = await User.findOne({
      passwordResetToken,
      passwordResetTokenExpires: { $gt: new Date() },
    }).exec();

    if (!user) {
      throw new AppError("Password reset token is invalid or has expired", 401);
    }

    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return user;
  });
}
