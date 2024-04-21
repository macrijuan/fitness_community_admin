const { Router } = require("express");
const router = Router();
const format = require("./controllers/format.js");
const existing = require("./controllers/existing.js");
const { Activity } = require("../../db.js");
const { unknown } = require("../../errors.js");
const locals_setter = require("../endware/get_many_setter.js");
const getMany = require("../endware/get_many.js");

router.post( "/post_activity",
  format,
  existing,
  async( req, res, next ) => {
    try{
      Activity.create({
        name:req.body.name,
        day:req.body.day,
        start_time:req.body.start_time,
        end_time:req.body.end_time,
        instructor:req.body.instructor,
        description:req.body.description,
        tag:req.body.tag
      }).then( activity => {
        if( activity ){
          locals_setter( res, "Activity", "Activities" );
          next();
        }else{
          res.status( 500 ).json( unknown );
        };
      });
    }catch(err){
      console.log( err );
      res.status( 500 ).json( unknown );
    };
  },
  getMany
);

module.exports = router;