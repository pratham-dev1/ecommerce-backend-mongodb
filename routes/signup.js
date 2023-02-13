const express = require("express");
const { signup } = require("../controllers/signup");
const router = express.Router();
const { body ,check} = require('express-validator');


router.post("/signup",
[
body('name','Please Enter a valid name').notEmpty().isString(),
// body('email').isEmail().withMessage("Please Enter a valid email"),  // email validation - we are doing in user model
check('password',"Password length must be 3 characters")
.escape()
.notEmpty()
.isLength({min: 3})   ,    
// .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{3,30}$/), // atleast and must contain uppercase lowercase number and special characters and min 3 - max30
body('address').isString().withMessage("Please Enter a valid address"),
body('pincode').isString().withMessage("Please Enter a valid pincode"),
body('image').isString().withMessage("Please Enter a valid image"),
],
signup );

module.exports = router;
