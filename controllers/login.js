const User = require("../models/user");
const Otp = require("../models/otp")
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require('crypto')
const { generateAccessToken, generateRefreshToken } = require("../helpers/generateTokens");
const { verifyRefreshToken } = require("../helpers/verifyRefreshToken");
const { emailForResetPassword,emailForResetPasswordAdmin } = require("../helpers/email");

exports.login = (req, res, next) => {
  let { email, password } = req.body;

  User.findOne({ email: email })
    .then(async (result) => {
      if (result) {
        let data = await bcrypt.compare(password, result.password);
        // console.log(data);    true or false
        if (data) {
          let { _id, name, email, image, address, pincode, role } = result;
          const token = await generateAccessToken(result)
          const refreshToken = await generateRefreshToken(result._id)
          res.send({
            token: token,
            refreshToken : refreshToken,
            result: { _id, name, email, image, address, pincode },
          });
        } else {
          res.send({ error: "Incorrect Password" });
        }
      } else {
        res.send({ error: "Invalid Credentials" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: "SERVER ERROR" });
    });
};


exports.refreshToken = async(req,res,next)=>{
  try{
  let {refreshToken} = req.body
    if(!refreshToken) {
      return res.status(403).send({message : "No token | Unauthorized"})
    }
      let user = await verifyRefreshToken(refreshToken)
      const result = await User.findById(user._id)
        if(result.refreshToken === refreshToken){            // will verify the refreshToken in database
        const token = await generateAccessToken(result)
        const newRefreshToken = await generateRefreshToken(result._id)
  
        return res.status(200).send({token : token , refreshToken: newRefreshToken})
        }
        else{
          return res.status(403).send({"message" : "Unauthorized | Invalid Token"})
        }
  }
      
      catch(err) {
        // console.log(err)
        if(err.statusCode){
          return res.status(err.statusCode).json({message:"You are not authenticated"})
        }
         res.status(500).send({message:"Internal server error"})
        }
    

}


exports.logout = async(req,res,next)=>{
  let {id} = req.body
   try{
  let result = await User.findById(id)
  result.refreshToken = ""
  await result.save()
  return res.status(200).json({message :"logged out successfully"})
   }
   catch(err){
    console.log(err)
    return res.status(500).json({message :"Internal server error"})
   }
}


exports.resetPassword = async(req,res,next)=>{
  try {
let {email} = req.body 

let user = await User.findOne({email:email})
if(!user) return res.status(200).json({error:true,message:"Invalid Email"})
 let newOtp = Math.floor(1000 + Math.random() * 9000); // create 4 random digits
 let expireTime = new Date(new Date().getTime() + 2*60000)  // adding 2 minute to the current date-time
 let isRecordExist = await Otp.findOne({email:email})// if record already in otp collection then we will update otp field
 if(isRecordExist){
  isRecordExist.otp = newOtp
  isRecordExist.expiresIn = expireTime
  isRecordExist.save()
 }
 else{
 let otp = new Otp({email:email , otp : newOtp,expiresIn:expireTime})
 await otp.save()
 }
 await emailForResetPassword(user.name,email,newOtp)
 res.status(200).send({message:"We have send one otp to your email ,Please check"})
  }
  catch(err){
console.log(err)
res.send({error:true,message:"Internal server error"})
  }
}



exports.verifyOtp = async(req,res,next) =>{
  let {otp,email} = req.body
  let result = await Otp.findOne({email:email,otp:otp})
  if(!result) return res.status(200).json({error:true,message:"Invalid otp"})
  if(new Date(result.expiresIn) < new Date()){
    return res.status(200).json({error:true,message:"Otp has Expired"})
  }
  return res.status(200).send({message:"otp verified"})
}



exports.updatePassword = async(req,res,next)=>{
  try {
let {password,email,otp} = req.body
let otpRecord  = await Otp.findOne({email:email,otp:otp})
if(!otpRecord) return res.status(200).json({error:true,message:"Invalid Email / otp"})
if(new Date(otpRecord.expiresIn) < new Date()){
  return res.status(200).json({error:true,message:"Otp has Expired"})
}
let user = await User.findOne({email:email})
if(!user) return res.status(200).json({error:true,message:"Invalid Email"})
let hash_password = await bcrypt.hash(password , 10)
user.password = hash_password
await user.save()
return res.status(200).json({message:"Password changed successfully"})
  }
  catch(Err){
    console.log(Err)
    return res.status(500).json({message: "Internal server error"})
  }
}




exports.resetPasswordAdmin = async(req,res,next)=>{
  try{
  let {email} = req.body
  
  let user = await User.findOne({email:email})
  if(!user) return res.status(200).json({error:true,message:"Invalid Email"})
  let key = crypto.randomBytes(25).toString('hex');
  user.resetPasswordKey = key
  await user.save()
  await emailForResetPasswordAdmin(user.name,email,key)
  res.status(200).send({message:"We have send one link to your email ,Please check"})


  }
  catch(err){
    console.log(err)
    res.send({error:true,message:"Internal server error"})
      }
}


exports.checkResetKey = async(req,res,next)=>{
  let {key} = req.body
let user = await User.findOne({resetPasswordKey:key})
if(!user) return res.status(200).json({error:true,message:"Invalid reset key"})
return res.status(200).json({error:false})
}


exports.updatePasswordAdmin = async(req,res,next)=>{
  try {
let {password,key} = req.body
let user = await User.findOne({resetPasswordKey:key})
if(!user) return res.status(200).json({error:true,message:"Invalid reset key"})
let hash_password = await bcrypt.hash(password , 10)
user.password = hash_password
await user.save()
return res.status(200).json({message:"Password changed successfully"})
  }
  catch(Err){
    console.log(Err)
    return res.status(500).json({message: "Internal server error"})
  }
}