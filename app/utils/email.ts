import nodemailer from "nodemailer";
import pug from "pug";
import __dirname from "~/utils/__dirname";
import { IUser } from "~/models/user.model";
import appConfig from "../../app.config";
import { join } from "node:path";

export default class Email {
  to: string;
  name: string;
  from: string;
  private transporter: nodemailer.Transporter;

  constructor(user: Pick<IUser, "name" | "email">) {
    this.to = user.email;
    this.name = user.name.split(" ")[0];
    this.from = `Yino <${appConfig.emailUsername}>`;
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: appConfig.emailUsername,
        pass: appConfig.emailPassword,
      },
    });
  }

  private async send(
    template: string,
    subject: string,
    data?: Record<string, string | number>,
  ) {
    const html = pug.renderFile(
      `${join(__dirname, "../email-templates", `${template}.pug`)}`,
      { ...data, firstName: this.name },
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendWelcome(photoUrl: string) {
    await this.send("welcome", "Welcome to Yino", { url: photoUrl });
  }

  async sendPasswordReset(url: string) {
    await this.send(
      "resetPassword",
      `Password reset (valid for only 10 minutes`,
      { url },
    );
  }

  async sendVerification(url: string) {
    await this.send(
      "resetPassword",
      `Password reset (valid for only 10 minutes`,
      { url },
    );
  }

  async sendOtp(otp: string) {
    await this.send("otp", `Your One Time Password (valid for only 2 minutes`, {
      otp,
    });
  }
}
