import { randomBytes } from "node:crypto";
import { promisify } from "node:util";
import { model, Model, Query, Schema, Types } from "mongoose";
import validator from "validator";
import scrypt from "~/utils/scrypt";
import createTimeStamp from "~/utils/timestamp";
import photoSchema, { IPhoto } from "~/models/schamas/photo.schema";
import { createHashSha256 } from "~/utils/hash";

const roles = ["client", "admin", "team"] as const;

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
  googleId?: string;
  profilePhoto?: IPhoto;
  username?: string;
  address?: Address;
  notificationOptions: NotificationOptions;
  otp?: string;
  otpExpires?: Date;
  isVerified?: boolean;
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
  destroyAndOtp(): Promise<void>;
  generateAndSaveToken(
    fieldName: "passwordResetToken" | "verificationToken",
  ): Promise<string>;
  compareToken(
    fieldName: "otp" | "passwordResetToken" | "verificationToken",
    token: string,
  ): boolean;
}

interface UserModel extends Model<IUser, NonNullable<unknown>, IUserMethods> {
  findUserByOtp(otp: string): ReturnType<typeof User.findOne>;
}

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minlength: [4, "name cannot be less than 4"],
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      index: 1,
    },
    email: {
      type: String,
      unique: true,
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
      select: false,
    },
    password: {
      type: String,
      required: [
        function () {
          return !this.googleId;
        },
        "Password is required",
      ],
      trim: true,
      select: false,
      validate: {
        validator: (value) =>
          /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=~`<>?/.,])[A-Za-z\d!@#$%^&*()_;\-+=~`<>?/.,]{8,50}$/.test(
            value,
          ),
        message: ({ value }) => {
          if (value.length < 8) {
            return "Password must be at least 8 characters";
          }
          if (value.length > 50) {
            return "Password must be at most 50 characters";
          }
          if (!/[A-Z]/.test(value)) {
            return "Password must contain at least one uppercase letter";
          }
          if (!/[!@#$%^&*()_\-+=~`<>?/.,]/.test(value)) {
            return "Password must contain at least one special character";
          }
          return "Invalid password";
        },
      },
    },
    passwordConfirm: {
      type: String,
      required: [
        function () {
          return !this.googleId;
        },
        "password confirmation is required",
      ],
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
    phoneNumber: {
      type: String,
    },
    isVerified: Boolean,
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
  if (
    (!this.googleId && this.isModified("password")) ||
    (!this.googleId && this.isNew)
  ) {
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

  this[fieldName] = createHashSha256(token);
  if (fieldName === "verificationToken") {
    this.verificationTokenExpires = new Date(createTimeStamp({ m: 10 }));
  } else if (fieldName === "passwordResetToken") {
    this.passwordResetTokenExpires = new Date(createTimeStamp({ m: 10 }));
  }
  await this.save({ validateBeforeSave: false });

  return token;
};

userSchema.methods.destroyAndOtp = async function () {
  this.otpExpires = undefined;
  this.otp = undefined;
  await this.save({ validateBeforeSave: false });
};
userSchema.methods.compareToken = function (fieldName, token) {
  switch (fieldName) {
    case "verificationToken": {
      return createHashSha256(token) === this.verificationToken;
    }
    case "passwordResetToken": {
      return createHashSha256(token) === this.passwordResetToken;
    }
    case "otp": {
      return createHashSha256(token) === this.otp;
    }
    default: {
      return false;
    }
  }
};

userSchema.methods.generateAndSaveOtp = async function () {
  const otp = generateOTP(6);

  this.otp = createHashSha256(otp);
  this.otpExpires = new Date(createTimeStamp({ m: 2 }));
  await this.save({ validateBeforeSave: false });

  return otp;
};

const User = model<IUser, UserModel>("User", userSchema);

export default User;

userSchema.static("findUserByOtp", function findUserByOtp(otp: string) {
  return User.findOne({
    otp: createHashSha256(otp),
    otpExpires: { $gt: new Date() },
  });
});

function generateOTP(length: number) {
  const digits = "0123456789";
  let OTP = "";
  const len = digits.length;
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * len)];
  }

  return OTP;
}
