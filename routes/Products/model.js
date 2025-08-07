const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category:{
      type: String,
      required: true,
    },
    measurements: {
      type: String,
      required: true,
    },
    materialUsed: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    productImage: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    otherDescription: {
      type: String,
    },
    otherImages: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("products", productSchema);

module.exports = productModel;
