const { Router } = require("express");
const router = Router();
const { custom_error, unknown } = require("../errors.js");

router.use((req, res, next) => {
  try{
    if ( req.session && req.session.user && req.get("X-Csrf-Token") === req.session.csrf_token ){
      next();
    }else{
      res.status(403).json( custom_error( "auth", "Try reloading the page. Request not authorized." ) );
    };
  }catch(err){
    console.log(err);
    res.status(500).json(unknown);
  };
});

module.exports=router;