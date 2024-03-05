const { Router } = require("express");
const router = Router();
const { unknown, sign_in_not_found } = require("../../errors.js");
const { Admin } = require("../../db.js");
const locals_setter = require("../endware/get_many_setter.js");
const getMany = require("../endware/get_many.js");

router.get("/sign_in",
  async(req,res)=>{
    try{
      Admin.findOne({
        where:{
          email:req.query.email,
          password:req.query.password
        }
      }).then(admin=>{
        if(admin){
          res.json(admin);
        }else{
          res.status(404).json( sign_in_not_found("administrator") );
        };
      })
    }catch(err){
      console.log(err);
      res.status(500).json(unknown);
    };
  }
);

router.get("/get_admins",
  ( req, res, next )=>{ locals_setter( res, "Admin", "Administrators" ); next(); },
  getMany
);

module.exports = router;