const passport    = require('passport');
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;
import { UserSchema } from "./models/user";

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},

function (email: any, password: any, cb: any) {

    //Assume there is a DB module pproviding a global UserModel
    return UserSchema.findOne({email, password})
        .then(user => {
            if (!user) {
                return cb(null, false, {message: 'Incorrect email or password.'});
            }

            return cb(null, user, {
                message: 'Logged In Successfully'
            });
        })
        .catch(err => {
            return cb(err);
        });
}
));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : 'your_jwt_secret'
},
function (jwtPayload: any, cb: any) {

    //find the user in db if needed
    return UserSchema.findOne(jwtPayload.id)
        .then(user => {
            return cb(null, user);
        })
        .catch(err => {
            return cb(err);
        });
}
));