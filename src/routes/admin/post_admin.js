const { Router } = require("express");
const router = Router();
const format = require("./controllers/format.js");
const existing = require("./controllers/existing.js")
const { unknown } = require("../../errors.js");
const { Admin } = require("../../db.js");
const { doubleSpaceEraser } = require("../formatter.js");
const locals_setter = require("../endware/get_many_setter.js");
const getMany = require("../endware/get_many.js");

router.post("/post_admin", 
  format,
  existing,
  async( req, res, next )=>{
    try{
      Admin.create({
        email:req.body.email,
        password:req.body.password,
        first_name:doubleSpaceEraser(req.body.first_name.toUpperCase()),
        last_name:doubleSpaceEraser(req.body.last_name.toUpperCase()),
        identity:req.body.identity
      }).then(admin=>{
        if(req.query.single){
          res.json(admin);
        }else{
          // locals_setter( res, "Admin", "Administrator" );
          res.locals.model = "Admin";
          res.locals.notFoundData = "Administrator";
          // console.log(res.locals);
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