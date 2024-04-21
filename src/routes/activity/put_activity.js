const { Router } = require("express");
const router = Router();

const format = require("./controllers/format.js");
const existing = require("./controllers/existing.js");
const getMany = require("../endware/get_many.js");
const locals_setter = require("../endware/get_many_setter.js");

const { Activity } = require("../../db.js");
const { not_found } = require("../../errors.js");

router.put( "/put_activity/:id",
  format,
  existing,
  async( req, res, next ) => {
    try{
      const activity = await Activity.findByPk( req.params.id );
      if( activity ){
        const updActy = await activity.update( res.locals.data );
        await updActy.save();
        locals_setter( res, "Activity", "Activities" );
        next();
      }else{
        res.status( 404 ).json( not_found( "Activity" ) );
      };
    }catch( err ){
      next( err );
    };
  },
  getMany
);

module.exports = router;