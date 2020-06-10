import * as passportLocal from 'passport-local';
import UserService from "../../services/user";
import AuthUtility from "../../utilities/auth";
import StringUtility from "../../utilities/string";

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = passportLocal.Strategy;

const userService = new UserService();

// Create Local Strategy (customized to expects emails instead of username)
const localOptions = {usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, async (email, password, done) => {
    try {
        const user: any = await userService.getByEmail(email);

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

// Options
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    // secretOrKey: process.env.SECRET,
    secretOrKey: 'hangman1230982',
    // secretOrKey: StringUtility.getEnv('SECRET'),
};

// Create JWT Strategy (login)
const jwtLogin = new JwtStrategy(jwtOptions, async (payload: any, done:any) => {
    try {
        /*If we want to add an expirey.
            For now, not yet.

        const iat = Math.floor(payload.iat / 1000);
        const now = Math.floor(Date.now() / 1000);

        if (now > iat + 86400) {
            return done(null, { expired: true });
        }*/

        const user: any = await userService.getById(payload.sub);

        if (user.length > 0) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    } catch (e) {
        return done(e, false)
    }
});

// Tell passport to use this strategy
passport.use(localLogin);
passport.use(jwtLogin);

export default passport;

