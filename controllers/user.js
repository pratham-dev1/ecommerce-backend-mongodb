const User = require("../models/user");
 
exports.addUser = (req, res, next) => {
  const { name, email ,password,image} = req.body;   
  const user = new User({name, email ,password,image});
  user
    .save()
    .then((result) => {
      res.send({ message: "INSERTED" });
    })
    .catch((err) => {
      console.log(err)
      res.send({ message: "ERROR : SOMETHING WENT WRONG" });
    });
};

exports.getUsers = (req, res, next) => {

  User.find()
    .then((result) => res.send(result))
    .catch((err) => res.send({ message: "ERROR : SOMETHING WENT WRONG" }));
};

exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((result) => res.send(result))
    .catch((err) => res.send({ message: err.message }));
};

exports.updateUser = (req, res, next) => {
  let fields = req.body;
  User.findById(req.params.userId)
    .then((user) => {
      // user.name = name;
      // user.email = email;
      // user.password = password,
      // user.image = image
      for (const key in fields) {
        user[key] = fields[key]; // partial update
      }
      return user.save(); // In the user we are also getting the save method
    })
    .then((result) => res.send({message:"UPDATED",result:result}))
    .catch((err) => res.send({ message: err.message }));
};

exports.deleteUser = (req, res, next) => {
  User.findByIdAndDelete(req.params.userId)
    .then((result) => res.send({message:"DELETED",result:result}))
    .catch((err) => res.send({ message: err.message }));
};


