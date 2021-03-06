import { Document, Model, model, Schema } from "mongoose";

export interface ISpot extends Document {
    title: string;
    price: string;
    date: string;
    img: string;
    user: string;
    userid: string;
}

export const SpotSchema = new Schema({
    title: { type: String, required: true },
    price: { type: String, required: true },
    date: { type: String, required: true },
    img: { type: String, required: true },
    user: { type: String, required: true },
    userid: { type: String, required: true }
});

export const Spot: Model<ISpot> = model<ISpot>("Spot", SpotSchema);
