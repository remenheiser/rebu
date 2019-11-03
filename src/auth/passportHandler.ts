import passport from "passport";
import passportJwt from "passport-jwt";
import passportLocal from "passport-local";
import { UserSchema } from "../models/user";

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    UserSchema.findOne({ email: email }, (err, user: any) => {
      if (err) { return done(err); }
      if (!user) {
        return done(undefined, false, { message: `email ${email} not found.` });
      }
      user.comparePassword(password, (err: Error, isMatch: boolean) => {
        if (err) { return done(err); }
        if (isMatch) {
          return done(undefined, user);
        }
        return done(undefined, false, { message: "Invalid username or password." });
      });
    });
}));

passport.use(new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "secret"
    }, function(jwtToken, done) {
      UserSchema.findOne({ email: jwtToken.email }, function(err, user) {
        if (err) { return done(err, false); }
        if (user) {
          return done(undefined, user , jwtToken);
        } else {
          return done(undefined, false);
        }
      });
}));
