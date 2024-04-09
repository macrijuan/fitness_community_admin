const { Router } = require("express");
const router = Router();
const locals_setter = require("../endware/get_many_setter.js");
const getMany = require("../endware/get_many.js");
const { Op } = require("sequelize");

router.get("/get_admins",
  ( req=null, res, next )=>{
    res.locals.data = {
      attributes:{ exclude:[  'password' ] },
      through:{
        attributes:[]
      },
      where:{
        [ Op.not ]:{ super_admin:true }
      }
    };
    locals_setter( res, "Admin", "Administrators" ); next();
  },
  getMany
);

// router.get("/test", (req,res)=>{
//   res.json({value:key()});
// })

module.exports = router;