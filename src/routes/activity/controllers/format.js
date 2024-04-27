const { Router } = require("express");
const router = Router();
const val = require("../../input_validations/activity_validation.js");
const { custom_error } = require("../../../errors.js");
const time = date => new Date( date ).getMilliseconds();

router.use( async( req, res, next ) => {
  try{
    const errors = {};
    res.locals.data = {};
    
    if( req.method === 'PUT' ){
      if( req.body.day){
        val.dayValidation( req.body.day, errors );
        res.locals.data.day = req.body.day;
      };
      if( req.body.description){
        val.descrValidation( req.body.description, errors );
        res.locals.data.description = req.body.description;
      };
      if( req.body.name){
        val.nameValidation( req.body.name, errors, "name" );
        res.locals.data.name = req.body.name;
      };
      if( req.body.instructor){
        val.nameValidation( req.body.instructor, errors, "instructor" );
        res.locals.data.instructor = req.body.instructor;
      };
      if( req.body.tag){
        val.tagValidation( req.body.tag, errors );
        res.locals.data.tag = req.body.tag;
      };
      if( req.body.start_time){
        val.timeValidation( req.body.start_time, errors, "start_time" );
        res.locals.data.start_time = req.body.start_time;
      };
      if( req.body.end_time){
        val.timeValidation( req.body.end_time, errors, "end_time" );
        res.locals.data.end_time = req.body.end_time;
      };
      if( req.body.start_time && req.body.end_time ){
        if( !errors.start_time && !errors.end_time ){
          const end_time = parseInt( req.body.end_time.replace( ":", "" ) );
          const start_time = parseInt( req.body.start_time.replace( ":", "" ) );
          if(  end_time >= start_time  ) errors.end_time = [ "The end time must be later than the start time" ];
        };
      };
      
    }else{
      val.dayValidation( req.body.day, errors );
      val.descrValidation( req.body.description, errors );
      val.nameValidation( req.body.name, errors, "name" );
      val.nameValidation( req.body.instructor, errors, "instructor" );
      val.tagValidation( req.body.tag, errors );
      val.timeValidation( req.body.start_time, errors, "start_time" );
      val.timeValidation( req.body.end_time, errors, "end_time" );
      if( !errors.start_time && !errors.end_time ){
        const end_time = parseInt( req.body.end_time.replace( ":", "" ) );
        const start_time = parseInt( req.body.start_time.replace( ":", "" ) );
        console.log(end_time, start_time);
        if(  end_time <= start_time  ) errors.end_time = [ "The end time must be later than the start time" ];
      };
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