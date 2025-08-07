const express = require("express");
const router = express.Router();

// get users listing
router.get("/",function(req,res,next){
    res.send("respond with a response");
})

module.exports = router;