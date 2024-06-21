const { Router } = require("express");
const router = Router();
const { Exercise } = require("../../../db.js");
const { custom_error, existing, multi_errors } = require("../../../errors.js");

router.use(async ( req, res, next ) => {
  try{
    if( req.method === "POST" ){
      const exercise = await Exercise.findOne({
        where:{
          name: req.body.name.toLowerCase(),
          video: req.body.video
        },
        raw:true
      });
      if( exercise ){
        res.status( 409 ).json(
          multi_errors({
            name: [ existing( "name" ) ],
            video: [ existing( "video" ) ]
          })
        );
      }else{
        next();
      };
    }else{
      const where = {};
      if( req.body.name ) where.name = req.body.name.toLowerCase();
      if( req.body.video ) where.video = req.body.video;
      const props = () => Object.keys( where ).length;
      if( props() ){
        const exercise = await Exercise.findOne({
          where,
          raw:true
        });
        if( exercise ){
          if( exercise.name === req.body.name ) where.name = [ existing( "name" ) ];
          if( exercise.video === req.body.video ) where.video = [ existing( "video" ) ];
          console.log( exercise.video, req.body.video );
          if( !props() ) return next();
          res.status( 409 ).json( multi_errors( where ) );
        }else{
          next();
        };
      }else{
        next();
      };
    };
  }catch(err){
    next( err );
  };
});

module.exports = router;

//POST - IF: error: 5/ ok: 6
//POST - no IF: error: 6 / ok: 7

//UPDATE - no IF: error: 