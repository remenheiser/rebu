import { Document, Model, model, Schema } from "mongoose";
import { UserSchema } from "./user";

export interface ISpot extends Document {
    title: string;
    price: string;
    img: string;
}

export const SpotSchema = new Schema({
    title: { type: String, required: true },
    price: { type: String, required: true },
    img: { type: String, required: true },
    users: { type: Array<Schema>(10), required: true }
});

export const Spot: Model<ISpot> = model<ISpot>("Spot", SpotSchema);
