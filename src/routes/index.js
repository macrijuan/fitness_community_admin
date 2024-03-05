const {Router}=require("express");
const router = Router();

const admin = require("./admin/index.js");

router.use( admin );

router.get("/", (req,res)=>{res.send("APP IS RUNNING")});

module.exports=router;