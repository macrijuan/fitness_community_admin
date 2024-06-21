const {Router}=require("express");
const router = Router();

const admin = require("./admin/index.js");
const activity = require("./activity/index.js");
const exercise = require("./exercise/index.js");

router.use( admin, activity, exercise );

router.get( "/", ( req, res )=>{ res.send("APP IS RUNNING") } );

module.exports = router;