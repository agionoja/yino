import { GoogleUser } from "~/models/user.model";
import asyncOperationHandler from "~/utils/async.operation";

type UserInfo = {
  id: string;
  email: string;
  name: string;
  verified: boolean;
};

export function findOrCreateUser({ id, name, email, verified }: UserInfo) {
  return asyncOperationHandler(async () => {
    let user = await GoogleUser.findOne({ email }).exec();

    if (user) {
      return user;
    }

    user = await GoogleUser.create({
      googleId: id,
      name,
      email,
      isVerified: verified,
    });

    user.isNew = true;
    return user;
  });
}
