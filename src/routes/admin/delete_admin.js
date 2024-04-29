const { Router } = require("express");
const router = Router();
const { not_found } = require("../../errors.js");
const { Admin } = require("../../db.js");
const locals_setter = require("../endware/get_many_setter.js");
const getMany = require("../endware/get_many.js");

router.delete("/delete_admin/:id",
  async( req, res, next )=>{
    try{
      Admin.findByPk(req.params.id)
      .then(async admin=>{
        if(admin){
          admin.destroy().then(()=>{
            if(req.query.single){
              res.json({deleted:`The Administrator with the email ${admin.email} has been deleted.`});
            }else{
              locals_setter( res, "Admin", "Administrators");
              next();
            };
          });
        }else{
          res.status(404).json( not_found( "Administrator" ) );
        };
      });
    }catch(err){
      next();
    };
  },
  (req,res,next)=>{ res.locals.model = "Admin"; res.locals.notFoundData = "Administrators"; next(); },
  getMany
);

module.exports = router;