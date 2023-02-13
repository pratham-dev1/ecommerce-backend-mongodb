const User = require("../models/user");
const bcrypt = require("bcrypt");
const {emailSender} = require("../helpers/email")
const { validationResult } = require('express-validator');

exports.signup = (req, res, next) => {
  let errors = validationResult(req)
  console.log(errors)
  if(!errors.isEmpty()){
return res.send({ message: errors.array()[0].msg });
  }
  let { name, email, password, address, pincode, image } = req.body;
  User.findOne({ email: email })
    .then((result) => {
      if (result) {
        res.send({ error:true,message: "Email Already exist" });
      } else {
        bcrypt.hash(password, 10, async function (err, hash_password) {
          try {
            let user = new User({name,email,password : hash_password,address,pincode,image});
            const result = await user.save();
            res.send({ result: result, message: "RECORD INSERTED" });
            return emailSender(name,email)
          } catch (err_1) {
            console.log("pratham",err_1)
            return res.send({ error: err_1 });
          }
        });
      }
    })

    .catch((err) => {
      console.log("prathams",err_1)

      res.send({ error: err })
    });
};
