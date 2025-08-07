const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    productId: {
      type: Array,
      required: true,
      ref:"products"
    },
    userId: {
      type: String,
      required: true,
      ref:"users"
    },
    orderStatus: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model("orders", orderSchema);
module.exports = orderModel;
