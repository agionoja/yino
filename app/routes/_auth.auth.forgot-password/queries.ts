import asyncOperationHandler from "~/utils/async.operation";
import { RegularUser } from "~/models/user.model";
import { AppError } from "~/utils/app.error";
import Email from "~/utils/email";
import { ROUTES } from "~/routes";

export async function sendPasswordResetToken(
  email: FormDataEntryValue | null,
  baseUrl: string,
) {
  return asyncOperationHandler(async () => {
    if (!email) {
      throw new AppError("Email is required to reset your password", 400);
    }

    const user = await RegularUser.findOne({ email }).exec();

    if (!user) {
      throw new AppError("User does not exit", 404);
    }

    const resetToken = await user.generateAndSaveToken("passwordResetToken");
    const passwordResetURL = `${baseUrl}${ROUTES.RESET_PASSWORD.replace(":token", resetToken)}`;

    try {
      await new Email(user).sendPasswordReset(passwordResetURL);
    } catch (e) {
      user.passwordResetToken = undefined;
      user.verificationTokenExpires = undefined;
      throw e;
    }
  });
}
