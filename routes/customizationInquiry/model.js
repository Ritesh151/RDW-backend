const mongoose = require("mongoose");

const customizationInquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    message:{
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

let customizationInquiryModel = mongoose.model(
  "customization inquiry",
  customizationInquirySchema
);
module.exports = customizationInquiryModel;
