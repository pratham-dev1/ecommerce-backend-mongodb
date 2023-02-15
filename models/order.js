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
    addressDetails: {
      name: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      mobile: { type: String, required: true },
      pincode: { type: String, required: true },
      address: { type: String, required: true },
      
    },
    paymentDetails : {
      cardHolderName : { type: String, required: true },
      cardNo : { type: String, required: true },
      expiry:{ type: String, required: true },
      cvv : { type: String, required: true }
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
});

module.exports = mongoose.model("Order", orderSchema);
