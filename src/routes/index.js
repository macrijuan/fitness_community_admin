const {Router}=require("express");
const router = Router();

const admin = require("./admin/index.js");
const activity = require("./activity/index.js");

router.use( admin, activity );

router.get( "/", ( req, res )=>{ console.log( "ip:", res.header['x-forwarded-for'] ); res.send("APP IS RUNNING") } );

module.exports = router;