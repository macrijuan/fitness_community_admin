const { Router } = require("express");
const router = Router();
const { custom_error, unknown } = require("../errors.js");
const crypto = require("crypto");

router.use((req, res, next) => {
  try{
    if (req.session && req.headers["x-csrf-token"] === req.session.csrf_token){
      if(req.session.user){
        res.cookie('fitcom.sid_encoded$', req.sessionID, {
          maxAge: 3600000,
          // secure: true,
          // httpOnly: true,
          sameSite: 'strict'
        });
        req.session.csrf_token = crypto.randomBytes(64).toString('hex');
        // req.session.csrf_token = "mytoken";
        res.setHeader( "x-csrf-token", req.session.csrf_token );
        next();
      }else if(req.session.approve_signup){
        req.session.usage = req.session.usage ?req.session.usage+1 :1
        if( req.session.usage > 3 ){
          req.session.destroy((err) => {
            if (err) {
              console.error(err);
              res.status(500).json(unknown);
            } else {
              res.json( { message:"Limit of sign up attempts exceeded." } );
            };
          });
          return;
        };
        if(req.get('x-csrf-token') !== req.session.approve_signup){
          res.json(custom_error("signup_code", "The code is invalid."));
        }else{
          next();
        };
      }else{
        res.status(403).json( custom_error( "auth", "Try reloading the page. Request not authorized." ) );  
      };
    }else{
      res.status(403).json( custom_error( "auth", "Try reloading the page. Request not authorized." ) );
    };
  }catch(err){
    console.log(err);
    res.status(500).json(unknown);
  };
});

module.exports=router;