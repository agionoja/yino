import jsonwebtoken from "jsonwebtoken";
import appConfig from "../../app.config";
import { Role } from "~/models/user.model";
import { Types } from "mongoose";

function isJwtPayload(decoded: any): decoded is jsonwebtoken.JwtPayload {
  return (
    typeof decoded === "object" &&
    decoded !== null &&
    !Array.isArray(decoded) &&
    typeof decoded.iat === "number" &&
    typeof decoded.exp === "number"
  );
}

const jwt = {
  sign: ({ id, role }: { id: Types.ObjectId; role: Role }): Promise<string> => {
    return new Promise((resolve, reject) => {
      jsonwebtoken.sign(
        { id, role },
        appConfig.jwtSecret,
        { expiresIn: appConfig.jwtExpires },
        (err, token) => {
          if (err) return reject(err);
          if (!token) return reject(new Error("Token is undefined"));
          return resolve(token);
        },
      );
    });
  },

  verify: (token: string): Promise<jsonwebtoken.JwtPayload> => {
    return new Promise((resolve, reject) => {
      jsonwebtoken.verify(token, appConfig.jwtSecret, (err, decoded) => {
        if (err) return reject(err);

        if (!isJwtPayload(decoded)) {
          return reject(new Error("Invalid JWT token"));
        }
        return resolve(decoded);
      });
    });
  },
};

export default jwt;
