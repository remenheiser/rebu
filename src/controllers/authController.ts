import { NextFunction, Request, Response } from "express";
import passport from "passport";
import "../auth/passportHandler"
//const passwordResetToken = require('../models/user');
const nodemailer = require('nodemailer');
import * as crypto from "crypto";
import { UserSchema, ResetTokenSchema } from "../models/user";

export class AuthController {
    public authenticateJWT(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("jwt", function (err, user, info) {
            if (err) {
                console.log(err);
                return res.status(401).json({ status: "error", code: "unauthorized" });
            }
            if (!user) {
                return res.status(401).json({ status: "!user", code: "unauthorized" });
            } else {
                console.log("auth sucessfull");
                return next();
            }
        })(req, res, next);
    }

    public authorizeJWT(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("jwt", function (err, user, jwtToken) {
            if (err) {
                console.log(err);
                return res.status(401).json({ status: "error", code: "unauthorized" });
            }
            if (!user) {
                return res.status(401).json({ status: "error", code: "unauthorized" });
            } else {
                const scope = req.baseUrl.split("/").slice(-1)[0];
                const authScope = jwtToken.scope;
                if (authScope && authScope.indexOf(scope) > -1) {
                    return next();
                } else {
                    return res.status(401).json({ status: "error", code: "unauthorized" });
                }
            }
        })(req, res, next);
    }

    public async ResetPassword(req: Request, res: Response) {
       passport.authenticate("jwt", async function (err, user, info) {
            if (!req.body.email) {
                return res
                    .status(500)
                    .json({ message: 'Email is required' });
            }
            const usr = await UserSchema.findOne({
                email: req.body.email
            });
            if (!usr) {
                return res
                    .status(409)
                    .json({ message: 'Email does not exist' });
            }
            var resettoken = new ResetTokenSchema({ _userId: usr._id, resettoken: crypto.randomBytes(16).toString('hex') });
            resettoken.save(function (err: any) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                ResetTokenSchema.find({ _userId: usr._id, resettoken: { $ne: resettoken.resettoken } }).remove().exec();
                res.status(200).json({ message: 'Reset Password successfully.' });
                var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    port: 465,
                    auth: {
                        usr: 'user',
                        pass: 'password'
                    }
                });
                var mailOptions = {
                    to: usr.email,
                    from: 'your email',
                    subject: 'Node.js Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'http://localhost:4200/response-reset-password/' + resettoken.resettoken + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                }
                transporter.sendMail(mailOptions, (err: any, info: any) => {
                })
            })
        })(req, res);  
    }
}
