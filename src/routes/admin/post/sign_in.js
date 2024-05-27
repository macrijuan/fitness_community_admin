const { Router } = require("express");
const router = Router();
const { verify } = require("argon2");
// const crypto = require("crypto");
const { sign_in_not_found, not_found } = require("../../../errors.js");
const { Admin, User } = require("../../../db.js");



router.post("/admin/sign_in",
  async(req,res)=>{
    try{
      // if(req.session.user) return res.status( 403 ).json(custom_error( "session", "This user is currently active." ));
      Admin.findOne({
        where:{
          email:req.body.email,
        },
        raw:true
      }).then(async admin=>{
        if(admin){
          verify("$argon2i$v=19$m=65536,t=3,p=4$"+admin.password, req.body.password)
          .then((match)=>{
            if(match){
              req.session.user = { id:admin.id, email:admin.email, csrf_token:'token' };
              if(admin.super_admin)req.session.user.super_admin=true;
              // req.session.csrf_token = crypto.randomBytes(64).toString('hex');
              req.session.csrf_token = 'token';
              res.setHeader('X-Csrf-Token', req.session.csrf_token);
              res.setHeader('Access-Control-Expose-Headers', 'X-Csrf-Token');
              delete admin.password;
              delete admin. reset_token;
              res.json( admin );
            }else{
              res.status(404).json( sign_in_not_found("administrator") );
            };
          });
        }else{
          res.status(404).json( not_found( "Administrator" ) );
        };
      });
    }catch(err){
     
    };
  }
);

router.get( "/", async( req, res, next )=>{ 
  try{
    const userTest = await User.create({
      email:"some@email.com",
      password:"$omePassw0rd",
      first_name:"TEST NAME",
      last_name:"TEST LASTNAME",
      identity:12341233,
      nickname:"whatever",
      sex:"male",
      age:20
    });
    res.json(userTest);
  }catch(err){
    next( err );
  };
 } );

module.exports = router;