const {Router}=require("express");
const router = Router();

const admin = require("./admin/index.js");

router.get("/", (req,res)=>{res.send("APP IS RUNNING")});
router.use( admin );

module.exports=router;