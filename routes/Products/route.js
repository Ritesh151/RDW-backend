const express = require("express");
const routes = express.Router();
const controller = require("./controller");

routes.post("/add-product",controller.createProduct);
routes.get("/get-all-products",controller.getAllProducts);
routes.get("/get-by-id/:id",controller.getById);
routes.put("/update-product-by-id/:id",controller.updateProductById);
routes.delete("/delete-product-by-id/:id",controller.deleteProductById);

module.exports = routes;