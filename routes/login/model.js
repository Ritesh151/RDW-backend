const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: mongoose.Schema.Types.Mixed,
    },
    role: {
      type: String,
    },
    responsibilities: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt'
  }
);

const loginModel = mongoose.model("admin", loginSchema);

module.exports = loginModel;
