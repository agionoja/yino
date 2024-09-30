import jsonwebtoken from "jsonwebtoken";
import appConfig from "../../app.config";
import { Types } from "mongoose";

interface Decoded extends jsonwebtoken.JwtPayload {
  _id: Types.ObjectId;
}

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
  sign: ({ _id }: { _id: Types.ObjectId }): Promise<string> => {
    return new Promise((resolve, reject) => {
      jsonwebtoken.sign(
        { _id },
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

  verify: (token: string): Promise<Decoded> => {
    return new Promise((resolve, reject) => {
      jsonwebtoken.verify(token, appConfig.jwtSecret, (err, decoded) => {
        if (err) return reject(err);

        if (!isJwtPayload(decoded)) {
          return reject(new Error("Invalid JWT token"));
        }
        return resolve(decoded as Decoded);
      });
    });
  },
};

export default jwt;
