import { model, Model, Query, Schema } from "mongoose";
import { isEmail } from "validator";
import scrypt from "~/utils/scrypt";
import createTimeStamp from "~/utils/timestamp";
import photoSchema, { IPhoto } from "~/models/schamas/photo.schema";

const roles = ["client", "admin", "company"] as const;

export type Role = (typeof roles)[number];

type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

type NotificationOptions = {
  allowEmailNotification?: boolean;
  allowPhoneNotification?: boolean;
};

interface IUserWithGet extends IUser {
  get: Query<IUser, never>["get"];
}

interface IUser {
  name: string;
  email: string;
  username: string;
  password: string;
  passwordConfirm: string | undefined;
  isActive: boolean;
  role: Role;
  is2fa: boolean;
  profilePhoto?: IPhoto;
  phoneNumber?: string;
  address?: Address;
  notificationOptions: NotificationOptions;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
  passwordChangedAt?: Date;
}

interface IUserMethods {
  comparePassword(plainPassword: string, password: string): Promise<boolean>;
  passwordChangedAfterJwt(jwtIat: number, passwordChangedAt: Date): boolean;
  generateAndSavePasswordResetToken(): string;
}

type UserModel = Model<IUser, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minlength: [4, "name cannot be less than 4"],
    },
    username: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      set: (v: string) => v.toLowerCase(),
      validate: [isEmail, "invalid email address"],
    },
    role: {
      type: String,
      enum: roles,
      default: "client",
    },
    is2fa: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "password confirmation is required"],
      validate: {
        validator: function (value: string) {
          const self = this as IUserWithGet;

          if (self.get && self.get("password")) {
            return self.get("password") === value;
          } else {
            return self.password === value;
          }
        },
        message: "passwords do not match",
      },
    },
    phoneNumber: String,
    address: String,
    profilePhoto: photoSchema,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await scrypt.hashPassword(this.password);
    this.passwordConfirm = undefined;
  }
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isNew && this.isModified("password")) {
    // 1 min. is deducted because of db write time
    this.passwordChangedAt = new Date(createTimeStamp({ m: -1 }));
  }
  next();
});

userSchema.methods.comparePassword = async function (
  plainPassword: string,
  hashedPassword: string,
) {
  return await scrypt.comparePassword(plainPassword, hashedPassword);
};

userSchema.methods.passwordChangedAfterJwt = function (
  jwtIat: number,
  passwordChangedAt: Date,
) {
  return jwtIat < passwordChangedAt.getTime() / 1000;
};

const User = model<IUser, UserModel>("User", userSchema);

export default User;
