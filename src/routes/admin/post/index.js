const { Router } = require("express");
const router = Router();
const argon2 = require("argon2");
const reqLimit = require("express-rate-limit");
const { unknown, not_found, req_limit, auth, custom_error } = require("../../../errors.js");
const { Admin } = require("../../../db.js");
const { doubleSpaceEraser } = require("../../formatter.js");
const { get_signup, get_signup_count } = require("./cookie_admin_signup_req.js");

router.post("/post_admin",
  reqLimit({
    windowMs: 3600000,
    max: 3,
    message:req_limit
  }),
  (req, res, next)=>{
    if(!req.session.user.superAdmin) return res.status( 403 ).json( auth( "administrator" ) );
    if(!get_signup_count())return res.status( 404 ).json( not_found( "Administrator sign up requests" ) );
    next();
  },
  async( req, res )=>{
    try{
      const newAdmin = get_signup(req.body.signup_code);
      if( !newAdmin ) return res.status( 404 ).json( not_found("Administrator sign up request") );
      if( req.body.signup_code !== newAdmin.signup_code ) return res.status( 403 ).json( custom_error("signup_code", "The sign up request code is invalid." ) );
      Admin.create({
        email:newAdmin.data.email,
        password:await argon2.hash( newAdmin.data.password, { type:argon2.argon2i } ).then(str=>str.slice(30,str.length)),
        first_name:doubleSpaceEraser(newAdmin.data.first_name.toUpperCase()),
        last_name:doubleSpaceEraser(newAdmin.data.last_name.toUpperCase()),
        identity:newAdmin.data.identity
      }).then(_admin=>{
        res.json({message:`Administrator sign up request approved.\nNow ${_admin.first_name+" "+_admin.last_name} is an administrator.`});
      });
    }catch(err){
      console.log(err);
      res.status(500).json(unknown);
    };
  }
);

router.get("/test", (req,res)=>{
  res.send(get_signup());
})

module.exports = router;