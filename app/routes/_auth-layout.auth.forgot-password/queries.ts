import asyncOperationHandler from "~/utils/async.operation";
import User from "~/models/user.model";
import { AppError } from "~/utils/app.error";

export async function getUser(email: FormDataEntryValue | null) {
  return asyncOperationHandler(async () => {
    if (!email) {
      throw new AppError("Email and password are required", 400);
    }

    const user = await User.findOne({ email }).lean().exec();

    if (!user) {
      throw new AppError("Email does not exit", 404);
    }

    return user;
  });
}
