const express = require("express");
const { getProducts, getProductById, addOrder, orderHistory, uploadMultipleImages } = require("../controllers/shop");
const {verifyJWT} = require("../middleware/auth");
const router = express.Router();
const upload = require("../helpers/multer")
const pdf = require('html-pdf');
const pdfTemplate = require('../helpers/pdf');
const path = require("path")
const Order = require("../models/order")
const pdf2base64 = require('pdf-to-base64');


router.get("/list-products",verifyJWT, getProducts);

router.get("/getProductById/:productId",verifyJWT, getProductById);

router.post('/add-order',verifyJWT,addOrder)

router.get('/getOrders',verifyJWT,orderHistory)

router.post('/upload-multiple-images',upload.any() , uploadMultipleImages)



router.post("/create-invoice-pdf", async (req, res) => {
 try{
  let {orderId } = req.body
  let order = await Order.findById({_id:orderId})
  // console.log(order)
  let orderDetails = order.products.map((item)=>{
    return{productName : item.name,price:item.price,size:item.size ,quantity:item.quantity}
  })

pdf.create(pdfTemplate(order.user.name,orderDetails, order.totalPrice),{}).toFile(`billing/Invoice-${orderId}.pdf`,(err) =>{
  if(err) {
     console.log("my error",err);
     return res.status(100).send({message:"error",error : err})
}
console.log("xxxx-------------------no error")
res.send(Promise.resolve())
})
}
catch(err){
    console.log("pdf-error :-",err)
}
  });

  router.post('/fetch-invoice-pdf', async(req, res) => {
    let {orderId} = req.body
    let base64 = await pdf2base64(path.join(__dirname,'../' ,'billing',`Invoice-${orderId}.pdf`))
    console.log(base64)
    res.send(base64)
    // res.sendFile(path.join(__dirname,'../' ,'billing',`Invoice-${orderId}.pdf`))  // we can send direct blob
  });

module.exports = router;
