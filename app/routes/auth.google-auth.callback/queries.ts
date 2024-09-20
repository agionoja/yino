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
    const user = await User.findOne({ email }).lean().exec();

    if (user) return { user, isNew: false };

    return {
      user: await User.create({
        googleId: id,
        name,
        email,
        isVerified: verified,
      }),
      isNew: true,
    };
  });
}
