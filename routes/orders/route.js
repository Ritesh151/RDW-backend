const express = require('express');
const routes = express.Router();
const controller = require('./controller');

routes.post("/create-order",controller.createOrder);
routes.get("/get-all-orders",controller.getOrders);
routes.put("/update-order-status/:orderId",controller.updateOrderStatus);
routes.post("/send-email",controller.sendEmail);
routes.get("/get-orders-by-id/:id",controller.getOrdersById);
module.exports=routes