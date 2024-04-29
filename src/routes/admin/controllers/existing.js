const { Router } = require("express");
const router = Router();

const { Admin } = require("../../../db.js");
const { custom_error, existing } = require("../../../errors.js");

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
        if(req.body.email === admin.email ){
          res.status(409).json( custom_error( "email", [ existing( "email" ) ] ) );
        }else{
          res.status(409).json( custom_error( "identity", [ existing( "identity" ) ] ) );
        };
      }else{
        next();
      };
    });
  }catch(err){
    next( err );
  };
});

module.exports=router;