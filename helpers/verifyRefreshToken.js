var jwt = require("jsonwebtoken");

exports.verifyRefreshToken = (refreshToken)=>{
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, (err, user) => {
            if (err) {
              console.log(err)
              return reject({error:true,message : "Invalid or expired refresh token",statusCode:403});
            }
            return resolve(user)
        })
    })
   
}