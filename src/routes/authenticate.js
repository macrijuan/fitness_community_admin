const { Router } = require("express");
const router = Router();
const { custom_error, unknown } = require("../errors.js");
const crypto = require("crypto");

router.use((req, res, next) => {
  try{
    if (req.session && req.get("X-CSRF-Token") === req.session.csrf_token){
      if(req.session.user){
        res.cookie('fitcom.sid_encoded$', req.sessionID, {
          maxAge: 3600000,
          // secure: true,
          // httpOnly: true,
          sameSite: 'strict'
        });
        // req.session.csrf_token = crypto.randomBytes(64).toString('hex');
        req.session.csrf_token = "token";
        res.setHeader( "X-CSRF-Token", req.session.csrf_token );
        next();
      }else{
        res.send("FALTA LA SESIÓN.");
        // res.status(403).json( custom_error( "auth", "Try reloading the page. Request not authorized." ) );  
      };
    }else{
      res.send("FALTA EL JEDER.");
      // res.status(403).json( custom_error( "auth", "Try reloading the page. Request not authorized." ) );
    };
  }catch(err){
    console.log(err);
    res.status(500).json(unknown);
  };
});

module.exports=router;