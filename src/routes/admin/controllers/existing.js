const { Router } = require("express");
const router = Router();
const { Op } = require("sequelize");

const { Admin } = require("../../../db.js");
const { custom_error, existing, unknown } = require("../../../errors.js");

router.use(( req, res, next )=>{
  try{
    Admin.findOne({
      where:{
        [Op.or]:[
          { email:req.body.email },
          { identity: req.body.identity }
        ]
      }
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