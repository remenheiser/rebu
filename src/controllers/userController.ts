import bcrypt from "bcrypt";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import mongoose from "mongoose";
import "../auth/passportHandler";
import { UserSchema } from "../models/user";
import { Application } from "../server";

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
		await UserSchema.findOneAndUpdate({ email: req.body.email }, { $addToSet: { watchlist: req.params.id } }, (err) => {
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
		await UserSchema.findOneAndUpdate({ email: req.body.email }, { $pull: { watchlist: req.params.id } }, (err) => {
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

	public async getWatchList(req: Request, res: Response): Promise<void> {
		await UserSchema.findOne({ email: req.body.email })
			.exec()
			.then((user) => {
				if (!user) {
					return res.status(500).json({
						error: "user not found"
					});
				} else {
					return res.status(200).json({
						watchlist: user.watchlist
					});
				}
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({
					error: err,
				});
			});
	}

	/**
	 * addUserImage (can also be use for update a user's image)
	 */
	public async addUserImage(req: Request, res: Response): Promise<void> {
		const userImageID = req.file.fieldname;
		await UserSchema.findOne({ email: req.body.email }, async (err: any, user: any) => {
			if (err) { res.send(err); }
			if (!user) {
				res.send({ err: "no user found" });
			} else {
				if (user.imgID === "null") {
					try {
						user.imgID = userImageID;
						await user.save();
						res.status(200).json({
							message: "user image added successfully",
							imgID: userImageID,
							email: req.body.email
						});
					} catch (err) {
						return res.status(500).json({ error: err });
					}
				} else {
					const oldImgID = user.imgID;
					user.imgID = userImageID;
					await user.save();

					Application.getGfs().find({ filename: oldImgID }).toArray((err: Error, file: any[]) => {
						if (err) { res.send(err); }
						if (!file || file.length === 0) {
							return res.status(404).json({
								err: "No such image exist"
							});
						}
						const imageId = file[0]._id;
						Application.getGfs().delete(imageId, (err) => {
							if (err) {
								res.send(err);
							} else {
								res.send("Successfully Updated User's Image");
							}
						});
					});
				}
			}
		});
	}

	/**
	 * deleteUserImage
	 */
	public async deleteUserImage(req: Request, res: Response): Promise<void> {
		await UserSchema.findOne({ email: req.body.email }, async (err: any, user: any) => {
			if (err) { res.send(err); }
			if (!user) {
				res.send({ err: "no user found" });
			} else {
				const imgID = user.imgID;
				user.imgID = "null";
				await user.save();

				Application.getGfs().find({ filename: imgID }).toArray((err: Error, file: any[]) => {
					if (err) { res.send(err); }
					if (!file || file.length === 0) {
						return res.status(404).json({
							err: "No such image exist"
						});
					}
					const imageId = file[0]._id;
					Application.getGfs().delete(imageId, (err) => {
						if (err) {
							res.send(err);
						} else {
							res.send("Successfully Deleted User's Image");
						}
					});
				});
			}
		});
	}

	// - GET - /spots/image/:id : return the ACTUAL image itself according to the image id
	public async getUserImage(req: Request, res: Response) {
		const imgTypeArr: string[] = ["image/jpeg", "image/png", "image/jpg"];

		Application.getGfs().find({ filename: req.params.id }).toArray((err: Error, file: Express.Multer.File[]) => {
			if (err) {
				res.send(err);
			}
			if (!file || file.length === 0) {
				return res.status(404).json({
					err: "No such image exist"
				});
			}
			if (imgTypeArr.includes(file[0].contentType)) {
				Application.getGfs().openDownloadStreamByName(file[0].filename).pipe(res);
			} else {
				res.status(404).json({
					err: "not an image"
				});
			}
		});
	}
}
