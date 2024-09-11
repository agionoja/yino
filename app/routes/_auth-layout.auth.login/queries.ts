import asyncOperationHandler from "~/utils/async.operation";
import User from "~/models/user.model";
import { AppError } from "~/utils/app.error";

export async function getUser(formData: { [key: string]: FormDataEntryValue }) {
  return asyncOperationHandler(async () => {
    const { email, password } = Object.freeze(formData);

    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const user = await User.findOne({ email }).select("+password").exec();
    if (
      !user ||
      !(await user.comparePassword(password as string, user.password))
    ) {
      throw new AppError("Invalid credentials", 401);
    }

    return user;
  });
}
