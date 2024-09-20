import asyncOperationHandler from "~/utils/async.operation";
import User from "~/models/user.model";
import { AppError } from "~/utils/app.error";
import appConfig from "../../../app.config";

export async function getUser(email: FormDataEntryValue | null) {
  return asyncOperationHandler(async () => {
    if (!email) {
      throw new AppError("Email is required to reset your password", 400);
    }

    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw new AppError("Email does not exit", 404);
    }

    if (user.googleId) {
      throw new AppError(
        "You registered with google. Chat gpt provide a standard response for such cases",
        400,
      );
    }

    const resetToken = user.generateAndSaveToken("passwordResetToken");
    const passwordResetURL =
      appConfig.nodeEnv === "production"
        ? ""
        : `http://localhost:${appConfig.port}/auth/resetPassword/${resetToken}`;

    return user;
  });
}
