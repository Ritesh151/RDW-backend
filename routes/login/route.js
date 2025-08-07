const express = require('express');
const routes = express.Router();
const controller = require("./controller");

routes.post("/create-admin",controller.createAdmin);
routes.post("/get-admin",controller.getAdminDetails);
routes.post("/get-admin-by-id/:id",controller.getAdminById);
routes.put("/update-admin-by-id/:id",controller.updateByIdAdmin);

module.exports = routes

