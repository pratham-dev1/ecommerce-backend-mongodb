const express = require("express");
const {
  addUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/user");
const {authRoleCheck} = require("../middleware/auth");
const router = express.Router();


router.get("/list-users", getUsers);

router.post("/add-user", addUser);

router.get("/getUserById/:userId", getUserById);

router.put("/edit-user/:userId", updateUser);

router.delete("/delete-user/:userId", deleteUser);



module.exports = router;
