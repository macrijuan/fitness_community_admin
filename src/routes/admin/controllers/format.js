const { Router } = require("express");
const router = Router();

const { emailVal, passwordVal, nameVal, identityVal, super_adminVal } = require("../../input_validations/admin_validation.js");
const { multi_errors, unknown } = require("../../../errors.js");

router.use(async( req, res, next )=>{
  const errors = {};
  if( res.locals.is_update ){
    if( 
      req.body.first_name === undefined
      && req.body.last_name === undefined
      && req.body.identity === undefined
      && req.body.super_admin === undefined
    ){
      res.status( 404 ).json( unknown );
      return;
    };
    res.locals.body = {};
    if( req.body.first_name ){ nameVal( req.body.first_name, errors, "first name" ); res.locals.body.first_name = req.body.first_name; };
    if( req.body.last_name ){ nameVal( req.body.last_name, errors, "last name" ); res.locals.body.last_name = req.body.last_name; };
    if( req.body.identity ){ identityVal( req.body.identity, errors ); res.locals.body.identity = req.body.identity; };
    if( req.body.super_admin !== undefined ){ super_adminVal( req.body.super_admin, errors ); res.locals.body.super_admin = req.body.super_admin };
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