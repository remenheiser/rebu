import bcrypt, { hash } from "bcrypt";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import mongoose from "mongoose";
import "../auth/passportHandler";
import { UserSchema, userSchema } from "../models/user";

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

	public async addWatchList(req: Request, res: Response): Promise<void> {
		await UserSchema.findOneAndUpdate({ email: req.body.email }, { $addToSet: { watchlist: req.params.id} }, (err) => {
			if (err) {
				return res.status(500).json({
					message: "add to watchlist failed"
				});
			} else {
				return res.status(200).json({
					message: "add to watchlist succeeded"
				});
			}
		});
	}

	public async removeWatchList(req: Request, res: Response): Promise<void> {
		await UserSchema.findOneAndUpdate({ email: req.body.email }, { $pull: { watchlist: req.params.id} }, (err) => {
			if (err) {
				return res.status(500).json({
					message: "remove from watchlist failed"
				});
			} else {
				return res.status(200).json({
					message: "remove from watchlist succeeded"
				});
			}
		});
	}
}
