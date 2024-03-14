const { Router } = require("express");
const router = Router();
const { verify } = require("argon2");
const crypto = require("crypto");
const { unknown, sign_in_not_found, custom_error } = require("../errors.js");
const { Admin, User } = require("../db.js");



router.post("/sign_in/admin",
  async(req,res)=>{
    try{
      Admin.findOne({
        where:{
          email:req.body.email,
        },
        raw:true
      }).then(async admin=>{
        if(admin){
          if(req.session.user) return res.json(custom_error( "session", "This user is currently active." ));
          verify("$argon2i$v=19$m=65536,t=3,p=4$"+admin.password, req.body.password)
          .then((match)=>{
            if(match){
              req.session.user = { id:admin.id, email:admin.email };
              req.session.csrf_token = crypto.randomBytes(64).toString('hex');
              // req.session.csrf_token = "mytoken";
              res.setHeader('x-csrf-token', req.session.csrf_token);
              delete admin.password;
              res.json(admin);
            }else{
              res.status(404).json( sign_in_not_found("administrator") );
            };
          });
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

router.post("/sign_in/user",
  async(req,res)=>{
    try{
      User.findOne({
        where:{
          email:req.body.email,
        },
        raw:true
      }).then(async user=>{
        if(user){
          verify("$argon2i$v=19$m=65536,t=3,p=4$"+user.password, req.body.password).then((match)=>{
            if(match){
              req.session.user = {id:user.id, email:user.email};
              // res.session.visits = req.session.visits ?req.session.visits+1 :1
              delete user.password;
              res.json(user);
            }else{
              res.status(404).json( sign_in_not_found("user") );
            };
          });
        }else{
          res.status(404).json( sign_in_not_found("user") );
        };
      })
    }catch(err){
      console.log(err);
      res.status(500).json(unknown);
    };
  }
);

module.exports = router;