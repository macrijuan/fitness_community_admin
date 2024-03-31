const { Router } = require("express");
const router = Router();

const getActivities = require("./get_activity.js");

router.use( "/activity", getActivities );

module.exports = router;