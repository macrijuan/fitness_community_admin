const { Router } = require("express");
const router = Router();

router.get( "/test", async( req, res, next ) => {
  try{
    
  }catch( err ){
    next( err );
  };
} );

module.exports = router;