const { Router } = require("express");
const router = Router();

const { emailVal, passwordVal, nameVal, identityVal, super_adminVal } = require("../../input_validations/admin_validation.js");
const { multi_errors } = require("../../../errors.js");

router.use(async( req, res, next )=>{
  const errors = {};
  if( res.locals.is_update ){
    res.locals.data = {};
    // if(req.body.email){ emailVal( req.body.email, errors ); res.locals.data.email = req.body.email; };
    // if(req.body.password){
    //   passwordVal( req.body.password, req.body.conf_password, errors );
    //   if(!errors.password){
    //     res.locals.data.password = await argon2.hash( req.body.password, { type:argon2.argon2i } ).then(str=>str.slice(30,str.length));
    //   };
    // };
    if( !(
      req.body.first_name || req.body.last_name || req.body.identity || req.body.super_admin
    ) )
    if( req.body.first_name ){ nameVal( req.body.first_name, errors, "first name" ); res.locals.data.first_name = req.body.first_name; };
    if (req.body.last_name ){ nameVal( req.body.last_name, errors, "last name" ); res.locals.data.last_name = req.body.last_name; };
    if( req.body.identity ){ identityVal( req.body.identity, errors ); res.locals.data.identity = req.body.identity; };
    if( req.body.super_admin ){ super_adminVal( req.body.super_admin, errors ); };
  }else{
    emailVal( req.body.email, errors );
    passwordVal( req.body.password, req.body.conf_password, errors );
    nameVal( req.body.first_name, errors, "first name" );
    nameVal( req.body.last_name, errors, "last name" );
    identityVal( req.body.identity, errors );
  };
  if( Object.keys( errors ).length ){
    res.status( 403 ).json( multi_errors( errors ) );
  }else{
    next();
  };
});

module.exports=router;