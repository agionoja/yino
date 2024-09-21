import asyncOperationHandler from "~/utils/async.operation";
import User from "~/models/user.model";
import { AppError } from "~/utils/app.error";
import appConfig from "../../../app.config";

export async function sendPasswordResetToken(email: FormDataEntryValue | null) {
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

    // TODO send this to the user email
    const passwordResetURL =
      appConfig.nodeEnv === "production"
        ? `https://${appConfig.onlineHost}/auth/reset-password/${resetToken}`
        : `http://localhost:${appConfig.port}/auth/reset-Password/${resetToken}`;

    return { ok: true, passwordResetURL };
  });
}
