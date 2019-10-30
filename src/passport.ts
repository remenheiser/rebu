// Importing Passport, strategies, and config
const passport = require('passport'),
    User = require('../model/user'),
    config = require('../config/config'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    mongoose = require('mongoose');

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret
};

// Setting up JWT login strategy
const JWTLogin = new JwtStrategy(jwtOptions, function (payload:any, done:any) {
    let id = new mongoose.Types.ObjectId(payload._id);
    User.findById(id, function (err:any, user:any) {
        if (err) { return done(err, false); }

        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });

});
passport.use(JWTLogin);
export let requireAuth = passport.authenticate('jwt', { session: false });       
