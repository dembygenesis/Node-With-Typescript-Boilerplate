import Bcrypt from 'bcrypt-nodejs';
import Jwt from 'jwt-simple';

export default class AuthUtility {
    static async getHashed(string: string) {
        return new Promise((resolve, reject) => {
            Bcrypt.genSalt(10, (err: Error, salt: string) => {
                if (err) {
                    return reject(err);
                }

                Bcrypt.hash(string, salt, () => {}, (err: Error, hash: string) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(hash);
                });
            });
        });
    }

    static async compareHashed(string: string, hashedString: string) {
        return new Promise((resolve, reject) => {
            Bcrypt.compare(string, hashedString, (error: Error, isMatch: boolean) => {
                if (error)
                    return reject("Something went wrong when trying to match the hashed string");
                if (!isMatch)
                    return resolve(false);
                if (isMatch)
                    return resolve(true);
            });
        });
    }

    static getJWT(string: string, secret: string) {
        const timestamp = new Date().getTime();

        // keys "sub" and "iat" are jwt key conventions required.
        return Jwt.encode({sub: string, iat: timestamp}, secret);
    }
}
