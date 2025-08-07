const express = require('express');
const routes = express.Router();
const controller = require("./controller");

routes.post("/create-user",controller.createUser);
routes.post("/get-user",controller.getUser);
routes.get("/get-user-by-id/:id",controller.getById);
routes.put("/update-user-by-id/:id",controller.updateUserById);
routes.get("/get-all-users",controller.getAllUsers);
module.exports = routes;