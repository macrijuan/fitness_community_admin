const { Router } = require("express");
const router = Router();
const { Op } = require("sequelize");
const format = require("../controllers/format_self.js");
const existing = require("../controllers/existing.js");
const { not_found, auth } = require("../../../errors.js");
const { Admin } = require("../../../db.js");

router.put("/update_self/:id",
  ( req, res, next ) => {
    req.session.usage = req.session.usage ?req.session.usage+1 :1
    if( !req.params.id || !( req.session.user.id+"" === req.params.id ) ) return res.status( 403 ).json( auth( "user" ) );
    res.locals.is_update = true;
    next();
  },
  format,
  existing,
  async( req, res )=>{
    try{
      const admin = await Admin.findByPk( req.params.id, { attributes:{ exclude:[ 'password', 'reset_token' ] } } );
      if( admin ){
        admin.update(res.locals.body)
        .then( async update=>update.save().then( admin=>admin ) )
        .then( _admin=>{
          res.json( _admin );
        }).catch( err => { next( err ); } );
      }else{
        res.status(404).json( not_found( "Administrator" ) );
      };
    }catch(err){
      next( err );
    };
  }
);

module.exports = router;