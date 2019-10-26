// import * as mongoose from "mongoose";
import mongoose = require("mongoose");

// require('./models/users.ts'); //NOT sure if this belongs in here or in 
// require('./config/passport.ts');
const uri: string = "mongodb+srv://rebu:Silber@rebu-8bwui.mongodb.net/test?retryWrites=true&w=majority";
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true );
mongoose.connect(uri, (err: any) => {
if (err) {
    console.log(err.message);
} else {
    console.log("Successfully Connected to MongoDB");
}
});

export const SpotSchema = new mongoose.Schema({
    title: {type: String, required: true},
    price: {type: String, required: true},
    img: {type: String, required: true}

});

const Spot = mongoose.model("Spot", SpotSchema);
export default Spot;
