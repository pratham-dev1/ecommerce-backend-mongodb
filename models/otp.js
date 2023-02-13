const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const otpSchema = new Schema({
    email:{
        type:String,
        require:true
    },
    otp:{
        type:String,
        required:true
    },
    expiresIn : {
        type:String,
        required:true
    }
})

module.exports = mongoose.model("Otp", otpSchema);