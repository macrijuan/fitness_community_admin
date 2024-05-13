const { Router } = require("express");
const router = Router();
const { emailVal, passwordVal } = require("../../input_validations/admin_validation.js");
const { multi_errors, unknown } = require("../../../errors.js");

router.use(async( req, res, next )=>{
  const errors = {};
  if( req.body.email === undefined && req.body.password === undefined ){
    res.status( 404 ).json( unknown );
    return;
  };
  res.locals.body = {};
  if(req.body.email){ emailVal( req.body.email, errors ); res.locals.body.email = req.body.email; };
  if(req.body.password){
    passwordVal( req.body.password, req.body.conf_password, errors );
    if(!errors.password){
      res.locals.body.password = await argon2.hash( req.body.password, { type:argon2.argon2i } ).then(str=>str.slice(30,str.length));
    };
  };
  if( Object.keys( errors ).length ){
    res.status( 403 ).json( multi_errors( errors ) );
  }else{
    next();
  };
});

module.exports=router;