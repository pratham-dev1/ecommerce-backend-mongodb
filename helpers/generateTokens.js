var jwt = require("jsonwebtoken");
const User = require("../models/user");

const generateAccessToken = ({ _id, name, email, image, address, pincode, role }) => {
    return new Promise((resolve, reject) => {
        let accessToken = jwt.sign(
            { _id, name, email, image, address, pincode, role },
            process.env.ACCESS_TOKEN_SECRET_KEY,
            { expiresIn: '1h' }
          )
          if(!accessToken) reject(new Error('no token generated'))
           return resolve(accessToken)
    })
}



const generateRefreshToken = async(_id) => {
let newRefreshToken = await new Promise((resolve, reject) => { // first it wil wait here because we are using 'await and it is returning a promise' 
    let refreshToken = jwt.sign( 
        { _id :_id },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: '2h' }
      )
        return resolve(refreshToken)      
    })
                                                  // once resolved above promise it will continue to execute the code         
    const user = await User.findById(_id)
    if(!user) reject(new Error('no user for this id'))
    user.refreshToken = newRefreshToken;         // updating the refreshToken in database
    const result = await user.save(); // In the user we are also getting the save method
    if(!result) reject(new Error('error in updating the token'))
    return newRefreshToken

}




module.exports ={generateAccessToken , generateRefreshToken}
