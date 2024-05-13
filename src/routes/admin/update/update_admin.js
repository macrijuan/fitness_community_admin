const { Router } = require("express");
const router = Router();
const { Op } = require("sequelize");
const format = require("../controllers/format.js");
const existing = require("../controllers/existing.js");
const { not_found, auth, custom_error } = require("../../../errors.js");
const { Admin } = require("../../../db.js");
const { doubleSpaceEraser } = require("../../formatter.js");
const locals_setter = require("../../endware/get_many_setter.js");
const getMany = require("../../endware/get_many.js");

router.put("/update_admin/:id",
  ( req, res, next ) => {
    if( !req.session.user.super_admin || !req.params.id ) return res.status( 403 ).json( auth( "user" ) );
    res.locals.is_update = true;
    next();
  },
  format,
  existing,
  async( req, res, next )=>{
    try{
      const admin = await Admin.findByPk( req.params.id );
      if( admin ){
        if(res.locals.body.first_name)res.locals.body.first_name = doubleSpaceEraser(res.locals.body.first_name);
        if(res.locals.body.last_name)res.locals.body.last_name = doubleSpaceEraser(res.locals.body.last_name);
        admin.update(res.locals.body)
        .then( async update=>update.save().then( admin=>admin ) )
        .then( _admin=>{
          if(req.query.single){
            res.json(_admin);
          }else{
            res.locals.data = {
              attributes:{ exclude:[  'password', 'reset_token' ] },
              through:{
                attributes:[]
              },
              where:{
                [ Op.not ]:{ super_admin:true }
              }
            };
            locals_setter( res, "Admin", "Administrators" );
            next(); 
          };
        }).catch( err => { next( err ); } );
      }else{
        res.status(404).json( not_found( "Administrator" ) );
      };
    }catch(err){
      next( err );
    };
  },
  getMany
);

module.exports = router;