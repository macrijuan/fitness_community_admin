const { Router } = require("express");
const router = Router();
const format = require("./controllers/format.js");
const existing = require("./controllers/existing.js")
const { Admin } = require("../../db.js");
const { unknown } = require("../../errors.js");

router.post("/post_admin", 
  format,
  existing,
  async(req,res)=>{
    try{
      Admin.create({
        email:req.body.email,
        password:req.body.password,
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        identity:req.body.identity
      }).then(admin=>{
        res.json(admin);
      });
    }catch(err){
      console.log(err);
      res.status(500).json(unknown);
    };
  }
);

module.exports = router;