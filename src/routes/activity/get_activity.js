const { Router } = require("express");
const router = Router();
const locals_setter = require("../endware/get_many_setter.js");
const getMany = require("../endware/get_many.js");

router.get("/get_activities",
  ( req, res, next )=>{
    locals_setter( res, "Activity", "Activities" ); next();
  },
  getMany
);

// router.get("/test", (req,res)=>{
//   res.json({value:key()});
// })

module.exports = router;