const Product = require("../models/product");
const Order = require("../models/order");


exports.addProduct = (req, res, next) => {
  // console.log(req.body,req.file)
  // console.log(req.fileValidationError)
  if(req.fileValidationError) return res.send({error:true,message: req.fileValidationError})
  if(req.fileSizeError) return res.send({error:true,message: req.fileSizeError})
  const { name, price, size, description } = req.body;
  const url = req.protocol + '://' + req.get('host')
  const file = url + '/public/uploads/' + req.file.filename

  const product = new Product({name,price,size,description,image : file,createdBy: { userId: req.user._id }});
  product.save()
    .then((result) => {
      res.status(201).send({ message: "INSERTED" });
    })
    .catch((err) => {
      console.log("tu hi tu",err);
      res.status(500).send({ error:true,message: "ERROR : SOMETHING WENT WRONG" });
    });
};

exports.getProducts = (req, res, next) => {
  let { sort, search, page } = req.query;

  // sorting
  let sorting = sort && JSON.parse(sort);

  //searching
  let searching = search && JSON.parse(search);
  let { search: SEARCH, searchOperator } = searching || {};
  let query = {};
  let Search_With_OR_Operator = [];

  if (searching) {
    for (const key in SEARCH) {
      //loop on object

      if (searchOperator === "and") {
        if (key === "price") {                           // this is for searching a number type field
          const regExp = new RegExp(SEARCH[key]);       
          query["$expr"] = {
            $regexMatch: {
              input: { $toString: `$${key}` },
              regex: regExp,
            },
          };
        } else {
          query[key] = new RegExp(SEARCH[key], "i"); // {'keyName' : new RegExp(string, 'i')}  for searching strings only
        }
      } else {
        if (key === "price") {
          const regExp = new RegExp(SEARCH[key]);
          Search_With_OR_Operator.push({
            $expr: {
              $regexMatch: {
                input: { $toString: `$${key}` },
                regex: regExp,
              },
            },
          });
          query["$or"] = Search_With_OR_Operator;

        } else {
          Search_With_OR_Operator.push({ [key]: new RegExp(SEARCH[key], "i") });
          query["$or"] = Search_With_OR_Operator;
        }
      }
    }
  }
  // console.log(query);

  //pagination
  let pagination = page && JSON.parse(page);
  let { pageNo, pageSize } = pagination || {};

  Product.find(query)
    .populate('createdBy.userId')
    .sort(sorting)
    .skip(pageNo * pageSize)
    .limit(pageSize)
    .then(async (result) => {
      try {
        const count = await Product.count();
        res.send({ result: result, totalItems: count });
      } catch (err) {
        return res.send({ message: "ERROR : ERROR IN COUNT" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({ message: "ERROR : SOMETHING WENT WRONG" });
    });
};

exports.getProductById = (req, res, next) => {
  Product.findById(req.params.productId)
    .then((result) => res.send(result))
    .catch((err) => res.send({ message: err.message }));
};

exports.updateProduct = (req, res, next) => {
  if(req.fileValidationError) return res.send({error:true,message: req.fileValidationError})
  if(req.fileSizeError) return res.send({error:true,message: req.fileSizeError})

  let fields = req.body;
  // console.log(req.file)
  // console.log(fields)
  Product.findById(req.params.productId)
    .then((product) => {
      // product.name = name;
      // product.price = price;
      // product.size = size;
      // product.description = description;
      // product.image = image;
      if(req.file){
        const url = req.protocol + '://' + req.get('host')
  const file = url + '/public/uploads/' + req.file.filename
        product["image"] = file
      }
      for (const key in fields) {
        product[key] = fields[key]; // partial update
      }
      return product.save(); // In the product we are also getting the save method
    })
    .then((result) => res.send({ message: "UPDATED", result: result }))
    .catch((err) => res.status(500).send({ error:true,message: err.message }));
};

exports.deleteProduct = (req, res, next) => {
  Product.findByIdAndDelete(req.params.productId)
    .then((result) => res.send({ message: "DELETED", result: result }))
    .catch((err) => res.send({ message: err.message }));
};


exports.getOrders = (req,res,next)=>{
  let {page} = req.query
  let limit = 3
  let pageNo = page - 1

  // Order.find({'user.userId':"63c14e46bb9f627015f944b6"})
  Order.aggregate([
    { $unwind: "$products" }, // unwind helps us to doing pagination of nested array
    { $skip: pageNo*limit },
    { $limit: limit },
    { $project: { products: "$products", user: "$user" } },
  ])
    .then((result) => {
      Order.aggregate([
        { $unwind: "$products" },
        { $project: { products: "$products", user: "$user" } },
        { $count: "count" },
      ]).then((count) => {
        res.send({result:result,count:count[0].count, totalPages: Math.ceil(count[0].count/limit)});
      });
    })
    .catch((err) => res.send(err));
}
