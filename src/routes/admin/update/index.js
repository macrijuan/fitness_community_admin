const { Router } = require("express");
const router = Router();

const update_self = require("./update_self_data.js");
const update_admin = require("./update_admin.js");

router.use( update_self, update_admin );

module.exports = router;