import { createHash, randomBytes } from "node:crypto";
import { promisify } from "node:util";
import { model, Model, Query, Schema, Types } from "mongoose";
import validator from "validator";
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

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  passwordConfirm: string | undefined;
  phoneNumber: string;
  isActive: boolean;
  role: Role;
  is2fa: boolean;
  profilePhoto?: IPhoto;
  username?: string;
  address?: Address;
  notificationOptions: NotificationOptions;
  otp?: string;
  otpExpires?: Date;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
  passwordChangedAt?: Date;
}

interface IUserMethods {
  comparePassword(plainPassword: string, password: string): Promise<boolean>;
  passwordChangedAfterJwt(jwtIat: number, passwordChangedAt?: Date): boolean;
  generateAndSaveOtp(): Promise<string>;
  generateAndSaveToken(
    fieldName: "passwordResetToken" | "verificationToken",
  ): Promise<string>;
  compareToken(
    fieldName: "otp" | "passwordResetToken" | "verificationToken",
    token: string,
  ): boolean;
}

type UserModel = Model<IUser, NonNullable<unknown>, IUserMethods>;

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
      validate: [validator.isEmail, "invalid email address"],
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
    otp: String,
    otpExpires: Date,
    verificationToken: String,
    verificationTokenExpires: Date,
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
    // 1 min. is deducted because of db latency time
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
  passwordChangedAt?: Date,
) {
  if (!passwordChangedAt) return false;

  return passwordChangedAt.getTime() / 1000 > jwtIat;
};

userSchema.methods.generateAndSaveToken = async function (fieldName) {
  const token = (await promisify(randomBytes)(32)).toString("hex");

  this[fieldName] = hash(token);
  if (fieldName === "verificationToken") {
    this.verificationTokenExpires = new Date(createTimeStamp({ m: 10 }));
  } else if (fieldName === "passwordResetToken") {
    this.passwordResetTokenExpires = new Date(createTimeStamp({ m: 10 }));
  }
  await this.save({ validateBeforeSave: false });

  return token;
};

userSchema.methods.compareToken = function (fieldName, token) {
  switch (fieldName) {
    case "verificationToken": {
      return hash(token) === this.verificationToken;
    }
    case "passwordResetToken": {
      return hash(token) === this.passwordResetToken;
    }
    case "otp": {
      return hash(token) === this.otp;
    }
    default: {
      return false;
    }
  }
};

userSchema.methods.generateAndSaveOtp = async function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

  this.otp = hash(otp);
  this.otpExpires = new Date(createTimeStamp({ m: 10 }));
  await this.save({ validateBeforeSave: false });

  return otp;
};

const User = model<IUser, UserModel>("User", userSchema);

export default User;

function hash(payload: string) {
  return createHash("sha256").update(payload).digest("hex");
}
