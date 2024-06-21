const { Router } = require("express");
const router = Router();
const val = require("../../input_validations/exercise_validation.js");

router.use( async( req, res, next ) => {
  try{
    const errors = {};
    res.locals.data = {};
    
    if( req.method === 'PUT' ){
      if( req.body.name !== undefined ){
        val.nameValidation( req.body.name, errors );
        res.locals.data.name = req.body.name;
      };
      if( req.body.muscle!== undefined ){
        val.muscleValidation( req.body.muscle, errors );
        res.locals.data.muscle = req.body.muscle;
      };
      if( req.body.body_part !== undefined ){
        val.body_partValidation( req.body.body_part, errors );
        res.locals.data.body_part = req.body.body_part;
      };
      if( req.body.video !== undefined ){
        val.videoValidation( req.body.video, errors );
        res.locals.data.video = req.body.video;
      };
    }else{
      val.nameValidation( req.body.name, errors );
      val.muscleValidation( req.body.muscle, errors );
      val.body_partValidation( req.body.body_part, errors );
      val.videoValidation( req.body.video, errors );
    };
  
    if( Object.keys( errors ).length ){
      return res.status( 403 ).json( { errors:errors } );
    };
  
    next();
  }catch( err ){
    next( err );
  };
});

module.exports = router;