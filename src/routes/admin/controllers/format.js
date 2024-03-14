const { Router } = require("express");
const router = Router();
const argon2 = require("argon2");

const { emailVal, passwordVal, nameVal, identityVal } = require("../../input_validations/admin_validation.js");
const { multi_errors } = require("../../../errors.js");

router.use(async( req, res, next )=>{
  res.locals.errors = {};
  if(res.locals.is_update){
    res.locals.data = {};
    if(req.body.email){ emailVal( req.body.email, res.locals.errors ); res.locals.data.email = req.body.email; };
    if(req.body.password){
      passwordVal( req.body.password, req.body.conf_password, res.locals.errors );
      if(!res.locals.errors.password){
        res.locals.data.password = await argon2.hash( req.body.password, { type:argon2.argon2i } ).then(str=>str.slice(30,str.length));
      };
    };
    if(req.body.first_name){ nameVal( req.body.first_name, res.locals.errors, "first name" ); res.locals.data.first_name = req.body.first_name; };
    if(req.body.last_name){ nameVal( req.body.last_name, res.locals.errors, "last name" ); res.locals.data.last_name = req.body.last_name; };
    if(req.body.identity){ identityVal( req.body.identity, res.locals.errors ); res.locals.data.identity = req.body.identity; };
  }else{
    emailVal( req.body.email, res.locals.errors );
    passwordVal( req.body.password, req.body.conf_password, res.locals.errors );
    nameVal( req.body.first_name, res.locals.errors, "first name" );
    nameVal( req.body.last_name, res.locals.errors, "last name" );
    identityVal( req.body.identity, res.locals.errors );
  };
  if(Object.keys( res.locals.errors ).length){
    res.status( 403 ).json( multi_errors( res.locals.errors ) );
  }else{
    next();
  };
});

module.exports=router;