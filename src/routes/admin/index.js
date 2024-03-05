const { Router } = require("express");
const router = Router();

const postAdmin = require("./post_admin.js");
const getAdmins = require("./get_admins.js");
const updateAdmin = require("./update_admin.js");
const deleteAdmin = require("./delete_admin.js");

router.use( "/admin", postAdmin, getAdmins, updateAdmin, deleteAdmin );

module.exports = router;