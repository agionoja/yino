import { scrypt as cryptoScrypt, randomBytes } from "node:crypto";
import { promisify } from "node:util";

const scrypt = {
  hashPassword: function (
    password: string,
    options?: { salt: number },
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      promisify(randomBytes)(options?.salt ? options.salt : 16)
        .then((saltBuffer) => {
          const salt = saltBuffer.toString("hex");

          cryptoScrypt(password, salt, 64, (err, derivedKey) => {
            if (err) return reject(err);

            const hashedPassword = `${salt}:${derivedKey.toString("hex")}`;
            return resolve(hashedPassword);
          });
        })
        .catch(reject);
    });
  },

  comparePassword: function (
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, key] = hashedPassword.split(":");

      cryptoScrypt(password, salt, 64, (err, derivedKey) => {
        if (err) return reject(err);

        return resolve(derivedKey.toString("hex") === key);
      });
    });
  },
};

export default scrypt;
