const { Router } = require("express");
const router = Router();
const format = require("../controllers/format.js");
const existing = require("../controllers/existing.js");
const { not_found, auth } = require("../../../errors.js");
const { Admin } = require("../../../db.js");
const { doubleSpaceEraser } = require("../../formatter.js");
const locals_setter = require("../../endware/get_many_setter.js");
const getMany = require("../../endware/get_many.js");

router.put("/update_admin/:id",
  ( req, res, next ) => {
    req.session.usage = req.session.usage ?req.session.usage+1 :1
    if( req.session.usage > 3 ){
      res.json(custom_error("req_limit", "Limit of sign up requests exceeded."));
      return;
    };
    if( !req.session.user.super_admin ){
      res.status( 403 ).json( auth( "user" ) );
      return;
    }else{
      res.locals.is_update = true;
      next();
    };
  },
  format,
  existing,
  async( req,res, next )=>{
    try{
      const admin = await Admin.findByPk(req.params.id)
      if(admin){
        if(res.locals.data.first_name)res.locals.data.first_name = doubleSpaceEraser(res.locals.data.first_name);
        if(res.locals.data.last_name)res.locals.data.last_name = doubleSpaceEraser(res.locals.data.last_name);
        admin.update(res.locals.data)
        .then( async update=>update.save().then( admin=>admin ) )
        .then( _admin=>{
          if(req.query.single){
            res.json(_admin);
          }else{
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