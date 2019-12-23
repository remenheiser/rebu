import { Document, Model, model, Schema } from "mongoose";
import { UserSchema } from "./user";

export interface ISpot extends Document {
    title: string;
    price: string;
    date: string;
    img: string;
    user: string;
    userid: string;
    //users: Array<Schema>;
    rating: number;
}

export const SpotSchema = new Schema({
    title: { type: String, required: true },
    price: { type: String, required: true },
    date: { type: String, required: true },
    img: { type: String, required: true },
    user: { type: String, required: true },
    userid: { type: String, required: true },
    //users: { type: Array<Schema>(10), required: true },
    rating: {type: Number, default: 0 }
});

export const Spot: Model<ISpot> = model<ISpot>("Spot", SpotSchema);
