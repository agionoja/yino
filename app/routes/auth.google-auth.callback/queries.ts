import User from "~/models/user.model";
import asyncOperationHandler from "~/utils/async.operation";

type UserInfo = {
  id: string;
  email: string;
  name: string;
  verified: boolean;
};

export function findOrCreateUser({ id, name, email, verified }: UserInfo) {
  return asyncOperationHandler(async () => {
    let user = await User.findOne({ email }).lean().exec();

    if (!user) {
      user = await User.create({
        googleId: id,
        name,
        email,
        isVerified: verified,
      });
    }

    return user;
  });
}
