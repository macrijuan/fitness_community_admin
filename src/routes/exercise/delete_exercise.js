const { Router } = require("express");
const router = Router();
const { Op } = require("sequelize");

const locals_setter = require("../endware/get_many_setter.js");
const getMany = require("../endware/get_many.js");

const { Exercise } = require("../../db.js");
const { not_found } = require("../../errors");

router.delete( "/delete_exercise/:id",
  async( req, res, next ) => {
    try{
      const ids = req.params.id.split( "+" );
      if( ids.length > 1 ){
        await Exercise.destroy({ where: { id:{ [ Op.in ]:ids } } });
        locals_setter( res, "Exercise", "Exercises" );
        next();
      }else{
        const exercise = await Exercise.findByPk( ids[ 0 ] );
        if( exercise ){
          await exercise.destroy();
          locals_setter( res, "Exercise", "Exercises" );
          next();
        }else{
          res.status( 404 ).json( not_found( "Exercise" ) );
        };
      };
    }catch( err ){
      next( err );
    };
  },
  getMany
);

module.exports = router;

