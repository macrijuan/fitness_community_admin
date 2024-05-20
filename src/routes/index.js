const {Router}=require("express");
const router = Router();

const admin = require("./admin/index.js");
const activity = require("./activity/index.js");

router.use( admin, activity );

router.get( "/", ( req, res )=>{ console.log( "ip:", req.ip, req.ips ); res.send("APP IS RUNNING") } );

module.exports = router;