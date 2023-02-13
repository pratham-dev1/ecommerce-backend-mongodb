const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: { type: Array, required: true },
  totalPrice: { type: Number, required: true },

  user: {
    name: {
      type: String,
      required: true,
    },
    address: {
      address: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
});

module.exports = mongoose.model("Order", orderSchema);
