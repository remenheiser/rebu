import bcrypt from "bcrypt";
import { Document, Error, Model, model, Schema } from "mongoose";

export interface IUser extends Document {
	email: string;
	username: string;
	password: string;
	watchlist: [string];
	imgID: string;
}

export const userSchema: Schema = new Schema({
	_id: Schema.Types.ObjectId,
	email: {
		type: String,
		required: true,
		unique: true,
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	},
	username: { type: String, required: true },
	password: { type: String, required: true },
	watchlist: { type: [String], required: true},
	imgID: { type: String, default: "null" }
});

userSchema.methods.comparePassword = function(candidatePassword: string, callback: any) {
	bcrypt.compare(candidatePassword, this.password, (err: Error, isMatch: boolean) => {
		callback(err, isMatch);
	});
};

export const UserSchema: Model<IUser> = model<IUser>("UserSchema", userSchema);
