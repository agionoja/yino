import {
  DocumentType,
  getModelForClass,
  prop,
  pre,
  getDiscriminatorModelForClass,
  modelOptions,
} from "@typegoose/typegoose";
import type { SubDocumentType } from "@typegoose/typegoose";
import validator from "validator";
import { Query } from "mongoose";
import type { Role } from "~/types";
import scrypt from "~/utils/scrypt";
import { promisify } from "node:util";
import { randomBytes } from "node:crypto";
import { createHashSha256 } from "~/utils/hash";
import createTimeStamp from "~/utils/timestamp";
import FileClass from "~/models/schamas/file.schema";

export const roles = ["client", "admin", "team"] as const;
enum USERS {
  GOOGLE = "google-user",
  REGULAR = "regular-user",
}

@modelOptions({
  schemaOptions: {
    collection: "users",
    timestamps: true,
  },
})
export class UserClass {
  @prop({
    required: [true, "name is required"],
    minlength: [4, "name cannot be less than 4 chars"],
    maxlength: [50, "name cannot be more than 50 chars"],
    type: () => String,
  })
  public name!: string;

  @prop({
    unique: true,
    sparse: true,
    type: () => String,
  })
  public username?: string;

  @prop({
    type: String,
    unique: true,
    required: [true, "email is required"],
    set: (v: string) => v.toLowerCase(),
    validate: [validator.isEmail, "invalid email address"],
  })
  public email!: string;

  @prop({
    type: String,
    enum: roles,
    index: 1,
    default: roles[0],
  })
  role!: Role;

  @prop({ type: () => String })
  public phoneNumber?: string;

  @prop({ type: () => Boolean })
  is2fa?: boolean;

  @prop({ default: true, select: false, type: () => Boolean })
  isActive!: boolean;

  @prop({ type: () => Boolean })
  public isVerified?: boolean;

  @prop({ type: () => String })
  public address?: string;

  @prop({ type: () => String })
  public otp?: string;

  @prop({ type: () => Date })
  public otpExpires?: Date;

  @prop({ type: () => String })
  public verificationToken?: string;

  @prop({ type: () => Date })
  public verificationTokenExpires?: Date;

  @prop({ type: () => FileClass })
  public profilePhoto?: SubDocumentType<FileClass>;

  @prop({ type: () => Date })
  public passwordChangedAt?: Date;

  @prop({ type: () => String })
  public passwordResetToken?: string;

  @prop({ type: () => Date })
  public passwordResetTokenExpires?: Date;

  public async comparePassword(plainPassword: string, hashedPassword: string) {
    return await scrypt.comparePassword(plainPassword, hashedPassword);
  }

  public passwordChangedAfterJwt(jwtIat: number, passwordChangedAt?: Date) {
    if (!passwordChangedAt) return false;

    return passwordChangedAt.getTime() / 1000 > jwtIat;
  }

  public async generateAndSaveToken(
    this: DocumentType<UserClass>,

    fieldName: "passwordResetToken" | "verificationToken",
  ) {
    const token = (await promisify(randomBytes)(32)).toString("hex");

    this[fieldName] = createHashSha256(token);
    if (fieldName === "verificationToken") {
      this.verificationTokenExpires = new Date(createTimeStamp({ h: 24 }));
    } else if (fieldName === "passwordResetToken") {
      this.passwordResetTokenExpires = new Date(createTimeStamp({ m: 10 }));
    }
    await this.save({ validateBeforeSave: false });

    return token;
  }

  public compareToken(
    fieldName: "otp" | "passwordResetToken" | "verificationToken",
    token: string,
  ) {
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
  }

  public async destroyOtpAndSave(this: DocumentType<UserClass>) {
    this.otpExpires = undefined;
    this.otp = undefined;
    await this.save({ validateBeforeSave: false });
  }

  public async generateAndSaveOtp(this: DocumentType<UserClass>) {
    const otp = generateOTP(6);

    this.otp = createHashSha256(otp);
    this.otpExpires = new Date(createTimeStamp({ m: 2 }));
    await this.save({ validateBeforeSave: false });

    return otp;
  }
}

@pre<UserClass>("save", function (next) {
  if (!this.isNew && this.isModified("password")) {
    // 1 min. is deducted because of db latency time
    this.passwordChangedAt = new Date(createTimeStamp({ m: -1 }));
  }
  next();
})
@pre<RegularUserClass>(
  "save",
  async function (this: DocumentType<RegularUserClass>, next) {
    if (this.isModified("password") || this.isNew) {
      this.password = await scrypt.hashPassword(this.password);
      this.passwordConfirm = undefined;
    }

    next();
  },
)
export class RegularUserClass extends UserClass {
  @prop({
    required: true,
    validate: passwordValidator(),
    type: () => String,
  })
  public password!: string;

  @prop({
    required: true,
    validate: {
      validator: function (
        this: RegularUserClass & Query<RegularUserClass, never>,
        value: string,
      ) {
        if (this.get("password")) {
          const password = this.get("password");

          return password === value;
        } else {
          return this.password === value;
        }
      },
      message: "passwords do not match",
    },
    type: () => String,
  })
  passwordConfirm?: string;
}

export class GoogleUserClass extends UserClass {
  @prop({
    unique: true,
    sparse: true,
    index: 1,
    type: () => String,
  })
  public googleId?: string;
}

const User = getModelForClass(UserClass);

export const GoogleUser = getDiscriminatorModelForClass(
  User,
  GoogleUserClass,
  USERS.GOOGLE,
);

export const RegularUser = getDiscriminatorModelForClass(
  User,
  RegularUserClass,
  USERS.REGULAR,
);

export default User;
function generateOTP(length: number) {
  const digits = "0123456789";
  let OTP = "";
  const len = digits.length;
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * len)];
  }

  return OTP;
}

function passwordValidator() {
  return {
    validator: (value: string) =>
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=~`<>?/.,])[A-Za-z\d!@#$%^&*()_;\-+=~`<>?/.,]{8,50}$/.test(
        value,
      ),
    message: ({ value }: { value: string }) => {
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
  };
}
