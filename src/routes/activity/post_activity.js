const { Router } = require("express");
const router = Router();
const format = require("./controllers/format.js");
const existing = require("./controllers/existing.js");
const { Activity } = require("../../db.js");

router.post( "/post_activity",
  format,
  existing,
  async( req, res, next ) => {
    try{
      await Activity.create({
        name:req.body.name,
        day:req.body.day,
        start_time:req.body.start_time,
        end_time:req.body.end_time,
        instructor:req.body.instructor,
        description:req.body.description,
        tag:req.body.tag
      });
      res.sendStatus( 204 );
    }catch(err){
      next( err );
    };
  }
);

module.exports = router;