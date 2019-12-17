import bcrypt from "bcrypt";
import { Document, Error, Model, model, Schema } from "mongoose";
import { Spot, SpotSchema } from "./spot";

export interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    rating: number;
    previousSpots: string;
}

export const userSchema: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    username: String,
    password: { type: String, required: true },
    rating: Number,
});

export const mongoose = require('mongoose');

// export const resettokenSchema = new mongoose.Schema({
//     _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
//     resettoken: { type: String, required: true },
//     createdAt: { type: Date, required: true, default: Date.now, expires: 43200 },
//  });

export const resettokenSchema: Schema = new Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    resettoken: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 },
 });


userSchema.methods.comparePassword = function(candidatePassword: string, callback: any) {
    bcrypt.compare(candidatePassword, this.password, (err: Error, isMatch: boolean) => {
        callback(err, isMatch);
    });
};

export const UserSchema: Model<IUser> = model<IUser>("UserSchema", userSchema);
export const ResetTokenSchema:any = mongoose.model('passwordResetToken', resettokenSchema);
//export const ResetTokenSchema: Model<IUser> = model<IUser>('passwordResetToken', resettokenSchema);