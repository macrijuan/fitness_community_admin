const { Router } = require("express");
const router = Router();

const { emailVal, passwordVal, nameVal, identityVal } = require("../../validations/admin_validation.js");
const { multi_errors } = require("../../../errors.js");

router.use(( req, res, next )=>{
  res.locals.errors = {};
  console.log(req.body);
  if(res.locals.is_update){
    if(req.body.email)emailVal( req.body.email, res.locals.errors );
    if(req.body.password)passwordVal( req.body.password, req.body.confPassword, res.locals.errors );
    if(req.body.first_name)nameVal( req.body.first_name, res.locals.errors, "first name" );
    if(req.body.last_name)nameVal( req.body.last_name, res.locals.errors, "last name" );
    if(req.body.identity)identityVal( req.body.identity, res.locals.errors );
  }else{
    emailVal( req.body.email, res.locals.errors );
    passwordVal( req.body.password, req.body.confPassword, res.locals.errors );
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