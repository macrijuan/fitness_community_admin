const { Router } = require("express");
const router = Router();
const { Op } = require("sequelize");
const { Activity } = require("../../../db.js");
const { custom_error } = require("../../../errors.js");

router.use(async ( req, res, next ) => {
  try{
    if( req.method === 'POST' ||  req.body.instructor ){
      const activity = await Activity.findOne({
        where:{
          instructor:req.body.instructor,
          [ Op.or]: [
            { start_time:{ [ Op.between ]:[ req.body.start_time, req.body.end_time ] } },
            { end_time:{ [ Op.between ]:[ req.body.start_time, req.body.end_time ] } }
          ]
        },
        raw:true
      });
      if( activity ){
        res.status( 409 ).json( custom_error( "instructor", `This instructor is scheduled to work on "${activity.name}" between ${activity.start_time} and ${activity.end_time}.`) );
      }else{
        next();
      };
    }else{
      next();
    };
  }catch(err){
    next( err );
  };
});

module.exports = router;