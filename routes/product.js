const express = require("express");
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getOrders,
  uploadMultipleImages,
} = require("../controllers/admin");
const {verifyJWT,authRoleCheck}  = require("../middleware/auth");
const router = express.Router();
const upload = require("../helpers/multer")


router.get("/list-products",[verifyJWT,authRoleCheck(['admin'])], getProducts);

router.post("/add-product",[verifyJWT,authRoleCheck(['admin']),upload.single('image')], addProduct);

router.get("/getProductById/:productId",[verifyJWT , authRoleCheck(['admin'])], getProductById);

router.put("/edit-product/:productId",[upload.single('image'),verifyJWT,authRoleCheck(['admin'])], updateProduct);

router.delete("/delete-product/:productId",[verifyJWT,authRoleCheck(['admin'])], deleteProduct);

router.get("/get-orders-admin",[verifyJWT,authRoleCheck(['admin'])],getOrders)



module.exports = router;
