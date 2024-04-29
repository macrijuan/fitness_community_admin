const { Router } = require("express");
const router = Router();
const sign_in = require("./post/sign_in.js");
const postAdmin = require("./post/index.js");
const getAdmins = require("./get_admins.js");
const updateAdmin = require("./update/update_admin.js");
const deleteAdmin = require("./delete_admin.js");

router.use( "/admin", postAdmin, getAdmins, updateAdmin, deleteAdmin );

module.exports = router;