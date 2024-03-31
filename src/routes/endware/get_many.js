const { Router } = require("express");
const router = Router();
const { not_found, unknown } = require("../../errors.js");
const models = require("../../db.js");

router.use(async(req,res)=>{
  try{
    if(!res.locals.data)res.locals.data={};
  res.locals.data={
    ...res.locals.data,
    attributes:{...res.locals.data.attributes},
    limit:(req.query.perPage || 12),
    offset:(req.query.index || 0)
  };
  
  const queries = Object.keys(req.query).filter(prop=>(prop!=="perPage" && prop!=="index" && prop !=="options" && prop !== "single"));
  if(queries.length){
    if(!res.locals.data.where)res.locals.data.where={};
    if(!res.ignore){
      queries.forEach(prop=>{
        switch(models[res.locals.model].getAttributes()[prop].type.constructor.key){
          case "STRING": res.locals.data.where[prop]={ ...res.locals.data.where[prop], [Op.substring]:req.query[prop] };
          break;
          default: res.locals.data.where[prop]=req.query[prop];
          // case "ARRAY": res.locals.data.where[prop]={ ...res.locals.data.where[prop], [Op.contains]:JSON.parse( req.query.ingredients ).data };
          // break;
        };
      });
    };
  };
  models[res.locals.model].findAndCountAll(res.locals.data)
  .then(_data=>{
    if(_data&&_data.rows.length){
      res.json(_data); 
    }else{
      res.status(404).json( not_found(res.locals.notFoundData) );
    };
  });
  }catch(err){
    console.log(err);
    res.status(500).json( unknown );
  };
});

module.exports = router;