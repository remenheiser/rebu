// import * as mongoose from "mongoose";
import mongoose = require("mongoose");

const uri: string = "mongodb+srv://rebu:Silber@rebu-8bwui.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(uri, (err: any) => {
if (err) {
    console.log(err.message);
} else {
    console.log("Successfully Connected to MongoDB");
}
});

export const SpotSchema = new mongoose.Schema({
    title: {type: String, required: true},
    price: {type: String, required: true}

});

const Spot = mongoose.model("Spot", SpotSchema);
export default Spot;
