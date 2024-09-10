import User from "~/models/user.model";
import AsyncOperationHandler from "~/utils/async.operation";

export async function createUser(formData: FormData) {
  return await AsyncOperationHandler(async () => {
    const { name, email, password, passwordConfirm, phoneNumber } =
      Object.fromEntries(formData);

    return await User.create({
      name,
      email,
      password,
      passwordConfirm,
      phoneNumber,
    });
  });
}
