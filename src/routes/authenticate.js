const { Router } = require("express");
const router = Router();
const { custom_error } = require("../errors.js");

router.use((req, res, next) => {
  try{
    if ( req.session && req.session.user && req.get("X-Csrf-Token") === req.session.csrf_token ){
      next();
    }else{
      console.log( "req.session: ", req.session !== undefined );
      console.log( "req.session.user: ", req.session.user );
      console.log( "X-Csrf-Token: ", req.get("X-Csrf-Token") );
      res.status(403).json( custom_error( "auth", "Try reloading the page. Request not authorized." ) );
    };
  }catch(err){
    next( err );
  };
});

module.exports=router;