const { Router } = require("express");
const router = Router();

const postAdmin = require("./postAdmin");

router.use("/admin", postAdmin);

module.exports = router;