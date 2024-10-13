import { AppError } from "~/utils/app.error";
import { RegularUser } from "~/models/user.model";
import asyncOperationHandler from "~/utils/async.operation";
import { createHashSha256 } from "~/utils/hash";
import scrypt from "~/utils/scrypt";

export async function resetPassword(
  formData: { [k: string]: FormDataEntryValue },
  passwordResetToken: string | undefined,
) {
  return asyncOperationHandler(async () => {
    const { password, passwordConfirm } = formData;

    if (!password || !passwordConfirm) {
      throw new AppError(
        "New password and password confirmation are required",
        400,
      );
    }

    const user = await RegularUser.findOne({
      passwordResetToken: createHashSha256(String(passwordResetToken)),
      passwordResetTokenExpires: { $gt: new Date() },
    })
      .select("+password")
      .exec();

    if (!user) {
      throw new AppError("Password reset token is invalid or has expired", 401);
    }

    const comparePassword = await scrypt.comparePassword(
      String(password),
      user.password,
    );

    if (comparePassword) {
      throw new AppError(
        "The new password cannot be the same as the old password.",
        400,
        "password",
      );
    }

    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.password = String(password);
    user.passwordConfirm = String(passwordConfirm);
    await user.save();
  });
}
