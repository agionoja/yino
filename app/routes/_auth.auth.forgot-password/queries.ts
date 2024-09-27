import asyncOperationHandler from "~/utils/async.operation";
import User from "~/models/user.model";
import { AppError } from "~/utils/app.error";
import Email from "~/utils/email";

export async function sendPasswordResetToken(
  email: FormDataEntryValue | null,
  baseUrl: string,
) {
  return asyncOperationHandler(async () => {
    if (!email) {
      throw new AppError("Email is required to reset your password", 400);
    }

    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw new AppError("User does not exit", 404);
    }

    if (user.googleId) {
      throw new AppError(
        "You signed up using Google. Please use Google to sign in.",
        400,
      );
    }

    const resetToken = await user.generateAndSaveToken("passwordResetToken");
    const passwordResetURL = `${baseUrl}/auth/reset-password/${resetToken}`;

    await new Email(user).sendPasswordReset(passwordResetURL);
  });
}
