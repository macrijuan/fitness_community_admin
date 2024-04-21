const { Router } = require("express");
const router = Router();
const { Op } = require("sequelize");

const locals_setter = require("../endware/get_many_setter.js");
const getMany = require("../endware/get_many.js");

const { Activity } = require("../../db.js");
const { not_found } = require("../../errors");

router.delete( "/delete_activity/:id",
  async( req, res, next ) => {
    try{
      const ids = req.params.id.split( "+" );
      if( ids.length > 1 ){
        await Activity.destroy({ where: { id:{ [ Op.in ]:ids } } });
        locals_setter( res, "Activity", "Activities" );
        next();
      }else{
        const activity = await Activity.findByPk( ids[ 0 ] );
        if( activity ){
          await activity.destroy();
          locals_setter( res, "Activity", "Activities" );
          next();
        }else{
          res.status( 404 ).json( not_found( "Activity" ) );
        };
      };
    }catch( err ){
      next( err );
    };
  },
  getMany
);

module.exports = router;

