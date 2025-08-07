const express = require("express");
const routes = express.Router();

// Import routes
const login = require("./login");
const products = require("./products");
const user = require("./user");
const order = require("./orders");
const customizationInquiry = require("./customizationInquiry");

// Use routes
routes.use("/admin", login.route);
routes.use("/products", products.route);
routes.use("/users", user.route);
routes.use("/orders", order.route);
routes.use("/customizationInquiry", customizationInquiry.route);

// Health check endpoint
routes.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

module.exports = {
  modules: {
    login,
    products,
    user,
    order,
    customizationInquiry
  },
  routes
};