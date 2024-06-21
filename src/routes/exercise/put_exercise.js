const { Router } = require("express");
const router = Router();

const format = require("./controllers/format.js");
const existing = require("./controllers/existing.js");
const getMany = require("../endware/get_many.js");
const locals_setter = require("../endware/get_many_setter.js");

const { Exercise } = require("../../db.js");
const { not_found } = require("../../errors.js");

router.put( "/put_exercise/:id",
  format,
  existing,
  async( req, res, next ) => {
    try{
      const exercise = await Exercise.findByPk( req.params.id );
      if( exercise ){
        const updExer = await exercise.update( res.locals.data );
        await updExer.save();
        locals_setter( res, "Exercise", "Exercises" );
        next();
      }else{
        res.status( 404 ).json( not_found( "Exercise" ) );
      };
    }catch( err ){
      next( err );
    };
  },
  getMany
);

module.exports = router;