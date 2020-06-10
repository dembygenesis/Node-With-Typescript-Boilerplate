import Passport from "passport";
import UserService from '../../services/user';
import AuthUtility from "../../utilities/auth";
import StringUtility from "../../utilities/string";
import {Response, Request, NextFunction} from "express";
import ResponseBuilderUtility from "../../utilities/response";

import {Strategy as JwtStrategy} from "passport-jwt";
import {ExtractJwt} from "passport-jwt";
import * as passportLocal from 'passport-local';

export default class PassportMiddleware {

    private passportInstance = Passport;
    private service = new UserService();

    private localLogin: any;
    private jwtLogin: any;

    private localOptions = {usernameField: 'email'};
    private jwtOptions = {
        jwtFromRequest: ExtractJwt.fromHeader('authorization'),
        secretOrKey: StringUtility.getEnv('SECRET'),
    };

    constructor() {
        this.setLocalStrategy();
        this.setJWTStrategy();

        this.passportInstance.use(this.localLogin);
        this.passportInstance.use(this.jwtLogin);
    }

    /**
     * "getAuthMiddleware" && "getAuthMiddleware" are what we need.
     */

    getAuthMiddleware = () =>  {
        return (req: Request, res: Response, next: NextFunction) => {
            this.passportInstance.authenticate('jwt', {session: false}, (err, user, info) => {
                console.log('user');
                console.log(user);

                if (err) {
                    return ResponseBuilderUtility.responseBuilder(
                        res,
                        500,
                        "Internal Server Error",
                        {
                            errors: ['Internal Server Error']
                        }
                    );
                }

                if (!user) {
                    return ResponseBuilderUtility.responseBuilder(
                        res,
                        401,
                        "Unauthorized",
                        {
                            errors: ["Unauthorized"]
                        }
                    );
                }

                if (user.expired) {
                    return ResponseBuilderUtility.responseBuilder(
                        res,
                        401,
                        "Token Expired.",
                        {
                            errors: ["Token Expired."]
                        }
                    );
                }

                req.user = user;
                return next();
            })(req, res, next);
        }
    };

    getSignInMiddleware = () =>  {
        return (req: Request, res: Response, next: NextFunction) => {
            this.passportInstance.authenticate('local', {session: false}, (err, user, info) => {
                if (err) {
                    return ResponseBuilderUtility.responseBuilder(
                        res,
                        401,
                        "Unauthorized",
                        {
                            errors: ["Unauthorized"]
                        }
                    );
                }

                if (!user) {
                    return ResponseBuilderUtility.responseBuilder(
                        res,
                        401,
                        "Unauthorized",
                        {
                            errors: ["Unauthorized"]
                        }
                    );
                }

                return next();
            })(req, res, next);
        }
    };

    getRoleMiddleware = (userType: Array<string>) => {
        return (req: Request, res: Response, next: NextFunction) => {

            let user: any = req.user;

            if (user) {
                user = user[0];
                const role = user.role;

                if (!userType.includes(role)) {
                    return ResponseBuilderUtility.responseBuilder(
                        res,
                        401,
                        "Unauthorized User Type",
                        {
                            errors: ["Unauthorized User Type"]
                        }
                    );
                }
            }

            next();
        }
    };

    setLocalStrategy() {
        this.localLogin = new passportLocal.Strategy(this.localOptions, async(email: string, password: string, done: any) => {
            try {
                const user: any = await this.service.getByEmail(email);

                if (user.length === 0) {
                    return done(null, false);
                }

                const hashedPassword = user[0]['password'];
                const passwordValid = await AuthUtility.compareHashed(password, hashedPassword);

                if (!passwordValid) {
                    return done(null, false);
                } else {
                    return done(null, user);
                }
            } catch (e) {
                return done(e, false);
            }
        });
    }

    setJWTStrategy() {
        this.jwtLogin = new JwtStrategy(this.jwtOptions, async (payload: any, done: any) => {

            try {
                if (this.isTokenExpired(payload)) {
                    return done(null, { expired: true });
                }

                const user: any = await this.service.getById(payload.sub);

                if (user.length > 0) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            } catch(e) {
                return done(e, false)
            }
        });
    }

    isTokenExpired(payload: any): boolean {
        const iat = Math.floor(payload.iat / 1000);
        const now = Math.floor(Date.now() / 1000);
        const tokenTimeoutDuration = parseFloat(StringUtility.getEnv('TOKEN_TIMEOUT_DURATION'));

        return now > iat + tokenTimeoutDuration;
    }
}

