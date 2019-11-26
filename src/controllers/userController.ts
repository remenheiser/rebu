import bcrypt, { hash } from "bcrypt";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import mongoose from "mongoose";
import "../auth/passportHandler";
import { UserSchema ,ResetTokenSchema } from "../models/user";

export class UserController {
	public async registerUser(req: Request, res: Response): Promise<void> {
		await UserSchema.find({ email: req.body.email })
			.exec()
			.then((user) => {
				if (user.length >= 1) {
					return res.status(409).json({
						error: "Email already exists, try again"
					});
				} else {
					const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
					const newUser = new UserSchema({
						_id: new mongoose.Types.ObjectId(),
						email: req.body.email,
						username: req.body.username,
						password: hashedPassword,
					});
					newUser
						.save()
						.then((result) => {
							console.log(result);
							res.status(201).json({
								message: "User created",
								user: result
							});
						})
						.catch((err) => {
							console.log(err);
							res.status(500).json({
								error: err,
							});
						});
				}
			});
	}

	public async loginUser(req: Request, res: Response): Promise<void> {
		await UserSchema.findOne({ email: req.body.email })
			.exec()
			.then((user) => {
				if (!user) {
					return res.status(401).json({
						message: "Auth failed 1",
					});
				}
				bcrypt.compare(req.body.password, user.password, (err, result) => {
					if (err) {
						return res.status(401).json({
							message: "Auth failed",
						});
					}
					if (result) {
						const token = jwt.sign({
							email: user.email,
							userID: user._id,
						},
							"secret",
							{
								expiresIn: "1h"
							});
						return res.status(200).json({
							message: "Auth successful",
							email: user.email,
							username: user.username,
							token: token
						});
					} else {
						return res.status(401).json({
							message: "Auth failed"
						});
					}
				});
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({
					error: err,
				});
			});
	}


	public async ValidPasswordToken(req: Request, res: Response) {
		if (!req.body.resettoken) {
			return res
				.status(500)
				.json({ message: 'Token is required' });
		}
		const user = await ResetTokenSchema.findOne({
			resettoken: req.body.resettoken
		});
		if (!user) {
			return res
				.status(409)
				.json({ message: 'Invalid URL' });
		}
		user.findOneAndUpdate({ _id: user._id }).then(() => {
			res.status(200).json({ message: 'Token verified successfully.' });
		}).catch((err: any) => {
			return res.status(500).send({ msg: err.message });
		});
	}

	public async NewPassword(req: Request, res: Response) {
		ResetTokenSchema.findOne({ resettoken: req.body.resettoken }, async function (err: any, userToken: any, next: any) {
			if (!userToken) {
				return res
					.status(409)
					.json({ message: 'Token has expired' });
			}
			const user = await ResetTokenSchema.findOne({
				resettoken: req.body.resettoken
			});
			user.findOne({
				_id: userToken._userId
			}, function (err: any, userEmail: any, next: any) {
				if (!userEmail) {
					return res
						.status(409)
						.json({ message: 'User does not exist' });
				}
				return bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
					if (err) {
						return res
							.status(400)
							.json({ message: 'Error hashing password' });
					}
					userEmail.password = hash;
					userEmail.save(function (err: any) {
						if (err) {
							return res
								.status(400)
								.json({ message: 'Password can not reset.' });
						} else {
							userToken.remove();
							return res
								.status(201)
								.json({ message: 'Password reset successfully' });
						}

					});
				});
			});
		})
	}
}

