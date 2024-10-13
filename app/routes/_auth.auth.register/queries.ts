import { RegularUser } from "~/models/user.model";
import asyncOperationHandler from "~/utils/async.operation";
import Email from "~/utils/email";
import { logDevError } from "~/utils/dev.console";

export async function createUser(
  formData: {
    [k: string]: FormDataEntryValue;
  },
  baseUrl: string,
) {
  return await asyncOperationHandler(async () => {
    const { name, email, password, passwordConfirm } = formData;

    const user = await RegularUser.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    const token = await user.generateAndSaveToken("verificationToken");

    try {
      await new Email(user).sendWelcome(`${baseUrl}/auth/verify/${token}`);
    } catch (err) {
      logDevError({ err });
    }

    return user;
  });
}
