const { Router } = require("express");
const router = Router();

const postAdmin = require("./post_admin");

router.use("/admin", postAdmin);

module.exports = router;