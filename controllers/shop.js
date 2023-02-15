const Product = require("../models/product");
const Order = require("../models/order");
const mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

exports.getProducts = (req, res, next) => {
  let { size, sortPrice, searchText, multipleSize, page } = req.query;
  let query = {
    $or: [
      { name: { $regex: searchText || "", $options: "i" } },
      { description: { $regex: searchText || "", $options: "i" } },
    ],
  };
  let sorting = {};
  if (size) {
    query["size"] = req.query.size;
  }
  if (sortPrice) {
    sorting["price"] = sortPrice;
  }
  if (multipleSize) {
    query["size"] = { $in: multipleSize.split(",") };
  }

  let pageNo = page - 1;
  let limit = 5;

  Product.find(query)
    .sort(sorting)
    .skip(pageNo * limit)
    .limit(limit)
    .then((result) => {
      Product.count()
        .then((count) =>
          res.send({
            result: result,
            totalItems: count,
            totalPages: Math.ceil(count / limit),
          })
        )
        .catch((err) => res.status(500).send({ message: "ERROR : SOMETHING WENT WRONG" }));
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: "ERROR : SOMETHING WENT WRONG" });
    });
};

exports.getProductById = (req, res, next) => {
  Product.findById(req.params.productId)
    .then((result) => res.send(result))
    .catch((err) => res.status(500).send({ message: err.message }));
};

exports.addOrder = (req, res, next) => {
  let { products, totalPrice, user } = req.body;

  let order = new Order({ products, totalPrice, user });
  order
    .save()
    .then((result) =>{
      res.status(200).send(result)
    } )
    .catch((err) => {
      console.log(err)
      res.status(501).send(err);
    })
};

exports.orderHistory = (req, res, next) => {
  let { page } = req.query;
  let limit = 3;
  let pageNo = page - 1 || 0;

  // Order.find({'user.userId':"63c14e46bb9f627015f944b6"})
  Order.aggregate([
    { $match: { "user.userId": ObjectId(req.user._id) } },
    { $unwind: "$products" }, // unwind helps us to doing pagination of nested array
    { $skip: pageNo * limit },
    { $limit: limit },
    { $project: { products: "$products", user: "$user" } },
  ])
    .then((result) => {
      Order.aggregate([
        { $match: { "user.userId": ObjectId(req.user._id) } },
        { $unwind: "$products" },
        { $project: { products: "$products", user: "$user" } },
        { $count: "count" },
      ]).then((count) => {
        res.send({
          result: result,
          count: count[0]?.count > 0 ? count[0]?.count : 0,
          totalPages:
            count[0]?.count > 0 ? Math.ceil(count[0]?.count / limit) : 0,
        });
      });
    })
    .catch((err) => res.status(500).send({message: "ERROR : SOMETHING WENT WRONG"}));
};


exports.uploadMultipleImages = (req,res,next)=>{
  console.log(req.files)

}

