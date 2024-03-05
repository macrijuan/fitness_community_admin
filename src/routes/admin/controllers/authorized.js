const { Router } = require("express");
const router = Router();

const { Admin } = require("../../../db.js");
const { custom_error, existing, unknown } = require("../../../errors.js");

router.use(( req, res, next )=>{
  try{
    Admin.findOne({
      where:{ email:req.query.alpha, password:req.query.beta, identity:req.query.gama }
    }).then(admin=>{
      if(admin){
        next();
      }else{
        res.json(custom_error("unauthorized", "Unauthrized request."));
      };
    });
  }catch(err){
    console.log(err);
    res.status(500).json( unknown );
  };
});

module.exports=router;