const { Router } = require("express");
const router = Router();
const { Op } = require("sequelize");
const { not_found, unknown } = require("../../errors.js");
const models = require("../../db.js");

router.use(async(req,res)=>{
  try{
    if( !res.locals.data ) res.locals.data={};
  res.locals.data = {
    ...res.locals.data,
    attributes:{ ...res.locals.data.attributes },
    limit:( req.query.perPage || 12 ),
    offset:( req.query.index || 0 )
  };
  
  const queries = Object.keys( req.query ).filter( prop=>( prop!=="perPage" && prop!=="index" && prop !=="options" ) );
  if( queries.length ){
  if(!res.locals.data.where)res.locals.data.where={};
    queries.forEach( prop=>{
      switch( models[ res.locals.model ].rawAttributes[ prop ].type.constructor.key ){
        case "STRING": res.locals.data.where[ prop ]={ ...res.locals.data.where[ prop ], [ Op.substring ]:req.query[ prop ] };
        break;
        case "ARRAY": res.locals.data.where[ prop ]={ ...res.locals.data.where[ prop ], [ Op.contains ]:JSON.parse( req.query.ingredients ).data };
        break;
        default: res.locals.data.where[ prop ]=req.query[ prop ];
      };
    } ); 
  };

  models[ res.locals.model ].findAndCountAll( res.locals.data )
  .then( async _data =>{
    if( _data && _data.rows.length ){
      if( req.query.options ){
        const attributes = _data.rows[ 0 ].rawAttributes;
        _data.options = { fields:{} };
        Object.keys( attributes ).forEach( attr => {
          switch( attributes[ attr ].type.constructor.key ){
            case 'ENUM': _data.options.fields[ attr ] = { type: 'select', data:attributes[ attr ].type.values };
            break;
            case 'ARRAY': _data.options.fields[ attr ] = { type: 'arr_input', data:[] };
            break;
            case 'BOOLEAN': _data.options.fields[ attr ] = { type: 'select', data:[ 'false', 'true' ] };
            break;
            case 'INTEGER': _data.options.fields[ attr ] = { type: 'num_input', data:"" };
            break;
            case 'TIME': _data.options.fields[ attr ] = { type: 'time_select', data:"06:00" };
            break;
            default: _data.options.fields[ attr ] = { type: 'str_input', data:"" };
          };
        });
        // models["Option"].findOne({
        //   where:{ model:res.locals.model }
        // }).then( options => {
        //   _data.options = options;
          res.json( _data ); 
        // });
      }else{
        res.json( _data ); 
      };
    }else{
      res.status(404).json( not_found( res.locals.notFoundData ) );
    };
  });
  }catch(err){
    console.log(err);
    res.status(500).json( unknown );
  };
});

module.exports = router;


//////////////////////////////////////////////////////////////////////////////////
// Object.keys( attributes ).forEach( attr => {
//   switch( attributes[ attr ].type.constructor.key ){
//     case 'ENUM': _data.options[ attr ] = { htmlTag: 'select', data:attributes[ attr ].type.value, handler:"select_h" };
//     break;
//     case 'ARRAY': _data.options[ attr ] = { htmlTag: 'input', data:"", handler:"arr_input_h" };
//     break;
//     case 'BOOLEAN': _data.options[ attr ] = { htmlTag: 'select', data:[ 'false', 'true' ], handler:"select_h" };
//     break;
//     default: _data.options[ attr ] = { htmlTag: 'input', data:"", handler:"str_input_h" };
//   };
// });