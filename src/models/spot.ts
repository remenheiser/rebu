import { Document, Model, model, Schema } from "mongoose";

export interface ISpot extends Document {
	title: string;
	price: string;
	address: string;
	imgID: string;
	dateListed: string;
	userName: string;
	userEmail: string;
	electric: boolean;
	covered: boolean;
}

export const SpotSchema = new Schema({
	title: { type: String, required: true },
	price: { type: String, required: true },
	address: { type: String, required: true },
	imgID: { type: String, required: true },
	dateListed: { type: String, required: true },
	userName: { type: String, required: true },
	userEmail: { type: String, required: true },
	electric: { type: Boolean, required: true },
	covered: { type: Boolean, required: true }
});

export const Spot: Model<ISpot> = model<ISpot>("Spot", SpotSchema);