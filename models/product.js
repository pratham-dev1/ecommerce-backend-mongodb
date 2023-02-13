const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdBy: {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    createdOn : {
      type :  Date,
      default : Date.now
    }
  },
});


module.exports = mongoose.model("Product", productSchema);
