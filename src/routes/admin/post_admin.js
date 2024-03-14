const { Router } = require("express");
const router = Router();
const { unknown } = require("../../errors.js");
const { Admin } = require("../../db.js");
const { doubleSpaceEraser } = require("../formatter.js");
const argon2 = require("argon2");
const locals_setter = require("../endware/get_many_setter.js");
const getMany = require("../endware/get_many.js");

router.post("/post_admin",
  async( req, res, next )=>{
    try{
      Admin.create({
        email:req.body.email,
        password:await argon2.hash( req.body.password, { type:argon2.argon2i } ).then(str=>str.slice(30,str.length)),
        first_name:doubleSpaceEraser(req.body.first_name.toUpperCase()),
        last_name:doubleSpaceEraser(req.body.last_name.toUpperCase()),
        identity:req.body.identity
      }).then(admin=>{
        if(req.query.single){
          res.json(admin);
        }else{
          locals_setter( res, "Admin", "Administrators" );
          next();
        };
      });
    }catch(err){
      console.log(err);
      res.status(500).json(unknown);
    };
  },
  getMany
);

module.exports = router;