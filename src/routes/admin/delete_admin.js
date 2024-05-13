const { Router } = require("express");
const router = Router();
const { not_found } = require("../../errors.js");
const { Admin } = require("../../db.js");
const locals_setter = require("../endware/get_many_setter.js");
const getMany = require("../endware/get_many.js");

router.delete("/delete_admin/:id",
  async( req, res, next )=>{
    try{
      const admin = await Admin.findByPk( req.params.id );
      if(admin){
        admin.destroy().then( () => {
          if(req.query.single){
            res.json({deleted:`The Administrator with the email ${admin.email} has been deleted.`});
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
            locals_setter( res, "Admin", "Administrators");
            next();
          };
        } );
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