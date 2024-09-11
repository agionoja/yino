import User from "~/models/user.model";
import asyncOperationHandler from "~/utils/async.operation";

export async function createUser(formData: {
  [k: string]: FormDataEntryValue;
}) {
  return await asyncOperationHandler(async () => {
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
