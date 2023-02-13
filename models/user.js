const mongoose = require("mongoose")
const {isEmail} = require('validator');

const Schema = mongoose.Schema

const userSchema = new Schema({
    name : {
        type : String,
        required: true,
    },
    email:{
        type : String,
        required : [true ,"enter email"],
        validate:{
            validator:isEmail,
            message:"Please enter a valid and unique email"
        }  ,
        // trim:true
    },
    password:{
        type : String,
        required : true,   
    },
    image:{
        type : String,
        required : true,   
    },
    address:{
        type : String,
        required : true
    },
    pincode :{
        type : String,
        required:true
    },
    role:{
        type : Array,
        required:true,
        default:["user"]
    },
    refreshToken : {
        type :String,
        default:""
    },
    resetPasswordKey : {
        type:String,
        default:""
    }
})



module.exports = mongoose.model('User',userSchema)