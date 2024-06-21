const { Router } = require("express");
const router = Router();

const format = require("./controllers/format.js");
const existing = require("./controllers/existing.js");

const { Exercise } = require("../../db.js");

router.post( "/post_exercise",
  format,
  existing,
  async( req, res, next ) => {
    try{
      await Exercise.create({
        name: req.body.name,
        muscle: req.body.muscle,
        body_part: req.body.body_part,
        video: req.body.video
      });
      res.sendStatus( 204 );
    }catch(err){
      next( err );
    };
  }
);

module.exports = router;