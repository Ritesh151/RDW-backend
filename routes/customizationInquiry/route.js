const express = require('express');
const  controller  = require('./controller');
const routes = express.Router();

routes.post("/create",controller.create);
module.exports= routes;