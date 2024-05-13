const { Router } = require("express");
const router = Router();
const postAdmin = require("./post/index.js");
const getAdmins = require("./get_admins.js");
const updateAdmin = require("./update/index.js");
const deleteAdmin = require("./delete_admin.js");

router.use( "/admin", postAdmin, getAdmins, updateAdmin, deleteAdmin );

module.exports = router;