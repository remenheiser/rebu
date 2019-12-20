
import { Request, Response } from "express";
import { ISpot, Spot } from "../models/spot";
import { Application } from "../server";
export class SpotController {

	// - GET - /spot # returns all spots
	public async allSpots(req: Request, res: Response): Promise<void> {
		await Spot.find((err: any, spots: any) => {
			if (err) {
				res.send(err);
			} else {
				res.send(spots);
			}
		});
	}

	// - GET - /spots/images : return all META DATA for all spot images in the database
	public async allSpotImages(req: Request, res: Response) {
		Application.getGfs().find().toArray((err: Error, files: Express.Multer.File[]) => {
			if (err) {
				res.send(err);
			}
			if (!files || files.length === 0) {
				return res.status(404).json({
					err: "No images exist"
				});
			}
			return res.json(files);
		});
	}

	// - GET - /spots/image/:id : return the ACTUAL image itself according to the image id
	public async getSpotImage(req: Request, res: Response) {
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

	// - GET - /spot/{1} # returns a spot with id 1
	public async getSpot(req: Request, res: Response): Promise<void> {
		await Spot.findById(req.params.id, (err: any, spot: any) => {
			if (err) {
				res.send(err);
			} else {
				res.send(spot);
			}
		});
	}

	// - PUT - /spot # inserts a new spot into the table
	public async addSpot(req: Request, res: Response): Promise<void> {
		const spot: ISpot = new Spot(req.body);
		spot.imgID = req.file.fieldname;
		console.log(spot);
		await spot.save((err: any) => {
			if (err) {
				res.send(err);
			} else {
				res.send(spot);
			}
		});
	}

	// - DELETE - /spot/{1} # deletes a spot with id of 1 its according spot image
	public async deleteSpot(req: Request, res: Response): Promise<void> {
		await Spot.findOne({ _id: req.params.id }, (err: any, spot: any) => {
			if (err) {
				res.send(err);
			}
			if (!spot) {
				res.send({
					err: "no spot found"
				});
			} else {
				const imgID = spot.imgID;
				Spot.deleteOne({ _id: spot._id }, (err: any) => {
					if (err) {
						res.send(err);
					} else {
						Application.getGfs().find({ filename: imgID }).toArray((err: Error, file: any[]) => {
							if (err) {
								res.send(err);
							}
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
									res.send("Successfully Deleted the Spot");
								}
							});
						});
					}
				});
			}
		});
	}

	// - POST - /spot/{1} # updates a spot with id of 1
	public async updateSpot(req: Request, res: Response): Promise<void> {
		await Spot.findByIdAndUpdate(req.params.id, req.body, (err: any, spot: any) => {
			if (err) {
				res.send(err);
			} else {
				res.send("Successfully Updated the Spot");
			}
		});
	}
}
