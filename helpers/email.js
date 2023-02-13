const nodemailer = require("nodemailer");

const emailSender = (name,email)=>{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'ecommerce.mongodb@gmail.com',
          pass: 'auckpzscdnaviwbz'
        }
      });
      
      var mailOptions = {
        from: 'ecommerce.mongodb@gmail.com',
        to: email,
        subject: 'SignUp Succeeded!',
        html : `<div>Hey ${name},</div> 
                <br/>
                <b>You have successfully signed up!!!</b>
                <br/>
                <h2>Welcome to React.js + node.js based ecommerce application</h2>
                `
      };
      
      return transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + JSON.stringify(info));
        }
      });
}



const emailForResetPassword = async(name,email,otp)=>{
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ecommerce.mongodb@gmail.com',
        pass: 'auckpzscdnaviwbz'
      }
    });
    
    var mailOptions = {
      from: 'ecommerce.mongodb@gmail.com',
      to: email,
      subject: 'Otp for reset password ',
      html : `<div>Hey ${name},</div> 
              <br/>
              <b>You have requested for resetting the password</b>
              <br/>
              <h2>Your Otp is ${otp}</h2>
              `
    };
    
    return await transporter.sendMail(mailOptions)
}


const emailForResetPasswordAdmin = async(name,email,key)=>{
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ecommerce.mongodb@gmail.com',
        pass: 'auckpzscdnaviwbz'
      }
    });
    
    var mailOptions = {
      from: 'ecommerce.mongodb@gmail.com',
      to: email,
      subject: 'Link for reset password ',
      html : `<div>Hey ${name},</div> 
              <br/>
              <b>You have requested for resetting the password</b>
              <br/>
              <h2>Please click on below link to update your password</h2>
              <a href="http://localhost:3000/update-password-admin/${key}">Click here to change password</a>
              `
    };
    
    return await transporter.sendMail(mailOptions)
}


module.exports = {emailSender,emailForResetPassword , emailForResetPasswordAdmin}