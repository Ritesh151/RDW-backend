const express = require("express");
const routes = express.Router();

const login = require("./login");
routes.use("/admin", login.route);

const products = require("./products");
routes.use("/products", products.route);

const user = require("./user");
routes.use("/users", user.route);

const order = require("./orders");
routes.use("/orders", order.route);

const customizationInquiry = require("./customizationInquiry");
routes.use("/customizationInquiry", customizationInquiry.route);

module.exports = {
  modules: {
    login,
    products,
    user,
    order,
    customizationInquiry
  },
  routes,
};

