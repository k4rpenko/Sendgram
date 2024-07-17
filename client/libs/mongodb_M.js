import mongoose from "mongoose"

const connMong = function() {
    try {
        mongoose.connect(process.env.MONODB_URI);
        console.log("Connect to Mong");
    } catch (error) {
        console.log(error);
    }
}

export default connMong;