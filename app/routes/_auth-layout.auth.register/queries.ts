import User from "~/models/user.model";
import AsyncOperationHandler from "~/utils/async.operation";

export async function createUser(formData: {
  [k: string]: FormDataEntryValue;
}) {
  return await AsyncOperationHandler(async () => {
    const { name, email, password, passwordConfirm, phoneNumber } = formData;

    return await User.create({
      name,
      email,
      password,
      passwordConfirm,
      phoneNumber,
    });
  });
}
