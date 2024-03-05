const { Router } = require("express");
const router = Router();
const { Op } = require("sequelize");

const { Admin } = require("../../../db.js");
const { custom_error, existing, unknown } = require("../../../errors.js");

router.use(( req, res, next )=>{
  try{
    res.locals.clause = {};
    if(res.locals.is_update){
      if(req.body.email || req.body.identity){
        if(req.body.email) res.locals.clause.email=req.body.email;
        if(req.body.identity) res.locals.clause.email=req.body.identity;
      }else{
        next();
      };
    }else{
      res.locals.clause={
        [Op.or]:[
          { email:req.body.email },
          { identity: req.body.identity }
        ]
      };
    };
    Admin.findOne({
      where:res.locals.clause
    }).then(admin=>{
      if(admin){
        if(req.body.email === admin.email ){
          res.status(409).json( custom_error( "email", [existing("email")] ) );
        }else{
          res.status(409).json( custom_error( "identity", [existing("identity")] ) );
        };
      }else{
        next();
      };
    });
  }catch(err){
    console.log(err);
    res.status(500).json( unknown );
  };
});

module.exports=router;