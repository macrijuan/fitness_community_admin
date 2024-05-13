const { Router } = require("express");
const router = Router();

const { Admin } = require("../../../db.js");
const { multi_errors, existing } = require("../../../errors.js");

router.use(( req, res, next )=>{
  try{
    const where = {};
    if( res.locals.is_update ){
      if( req.body.email || req.body.identity ){
        if(req.body.email) where.email = req.body.email;
        if(req.body.identity) where.identity = req.body.identity;
      }else{
        next();
      };
    };
    Admin.findOne({
      where:where
    }).then(admin=>{
      if(admin){
        const errors = {};
        if( req.body.email === admin.email ) errors.email = [ existing( "email" ) ];
        if( req.body.identity) errors.identity = [ existing( "identity" ) ];
        if( Object.keys( errors ).length ) res.status( 409 ).json( multi_errors( errors ) );
      }else{
        next();
      };
    });
  }catch(err){
    next( err );
  };
});

module.exports=router;