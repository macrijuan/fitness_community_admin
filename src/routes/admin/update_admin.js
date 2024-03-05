const { Router } = require("express");
const router = Router();
const format = require("./controllers/format.js");
const existing = require("./controllers/existing.js")
const { unknown, not_found } = require("../../errors.js");
const { Admin } = require("../../db.js");
const { doubleSpaceEraser } = require("../formatter.js");
const locals_setter = require("../endware/get_many_setter.js");
const getMany = require("../endware/get_many.js");

router.put("/update_admin/:id",
  ( req, res, next )=>{ res.locals.is_update = true; next(); },
  format,
  existing,
  async( req,res, next )=>{
    try{
      Admin.findByPk(req.params.id)
      .then(async admin=>{
        if(admin){
          if(res.locals.data.first_name)res.locals.data.first_name = doubleSpaceEraser(res.locals.data.first_name);
          if(res.locals.data.last_name)res.locals.data.last_name = doubleSpaceEraser(res.locals.data.last_name);
          admin.update(res.locals.data)
          .then( async update=>update.save().then( admin=>admin ) )
          .then( _admin=>{
            if(req.query.single){
              res.json(_admin);
            }else{
              locals_setter(res, "Admin", "Administrators");
              next(); 
            };
          })
        }else{
          res.status(404).json( not_found( "Administrator" ) );
        };
      });
    }catch(err){
      console.log(err);
      res.status(500).json(unknown);
    };
  },
  getMany
);

module.exports = router;