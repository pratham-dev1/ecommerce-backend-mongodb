const jwt = require("jsonwebtoken");

const verifyJWT = (req,res,next)=>{

  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
      if (err) {
        console.log(err)
        return res.status(401).send({message : "Invalid or expired token"});
      }
      req.user = user;
      next()
    });
  } else {
    res.status(401).send({message : "No token | Unauthorized"})
  }
};


const authRoleCheck = (requiredRoles) => {
  return (req,res,next) => {
    let userRoles = req.user.role  // Array
    let isAllowed = requiredRoles.map(allowedRoles => userRoles.includes(allowedRoles)).find(val => val === true)
    // console.log(isAllowed)   true or undefined        ........ if the find method get any true value in array then in will return true otherwise undefined    
    if(isAllowed) next()
    else return res.status(401).send({message : "Unauthorized"})

  }
 
};

module.exports = {verifyJWT,authRoleCheck};
