const express = require("express");
const bodyParser=require('body-parser');
const app = express();
const port = 5000;
const cors = require('cors')
const cookieParser = require("cookie-parser");
require('dotenv').config()



const mongoose = require("mongoose");

const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");
const shopRoutes = require("./routes/shop")
const loginRoutes = require('./routes/login')
const signupRoutes = require("./routes/signup")


app.use(cors())  
app.use(cookieParser());
// Parses the text as url encoded data
app.use(bodyParser.urlencoded({extended: true}));    // when we submit the form in ejs tempelate ..then we need this,...here we dont need
 
// Parses the text as json
app.use(bodyParser.json());

app.use("/public/uploads", express.static('public/uploads'))  // according to folder path we need to specify it here ..then only it will show the image on react side
app.use("/admin", productRoutes);
app.use("/user", userRoutes)
app.use("/shop",shopRoutes)
app.use(loginRoutes)
app.use(signupRoutes)



mongoose
  .connect(process.env.DB_URL)
  .then((result) => {
    // console.log(result);
    app.listen(process.env.PORT || port, () => {
        console.log(`app listening on port ${port}`);
      });
      
  })
  .catch((err) => console.log(err));

