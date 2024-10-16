import { GoogleUserModel } from "~/models/user.model";
import asyncOperationHandler from "~/utils/async.operation";

type UserInfo = {
  id: string;
  email: string;
  name: string;
  verified: boolean;
};

export function findOrCreateUser({ id, name, email, verified }: UserInfo) {
  return asyncOperationHandler(async () => {
    let user = await GoogleUserModel.findOne({ email }).exec();

    if (user) {
      return user;
    }

    user = await GoogleUserModel.create({
      googleId: id,
      name,
      email,
      isVerified: verified,
    });

    user.isNew = true;
    return user;
  });
}
