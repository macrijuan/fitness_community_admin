const { Router } = require("express");
const router = Router();

const getActivities = require("./get_activity.js");
const postActivity = require("./post_activity.js");
const putActivity = require("./put_activity.js");
const deleteActivities = require("./delete_activity.js");

router.use( "/activity", getActivities, postActivity, putActivity, deleteActivities );

module.exports = router;