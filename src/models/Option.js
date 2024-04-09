const { STRING, JSON, ARRAY, BOOLEAN } = require("sequelize");

module.exports = ( sequelize ) => {
  sequelize.define( 'option', {
    model:{
      type:STRING,
      primaryKey:true,
      unique:true
    },
    fields:{
      type:JSON
    },
    isNotUpdatable:{
      type:ARRAY( STRING ),
      defaultValue:[]
    },
    isRemovable:{
      type:BOOLEAN,
    }
  },{
    timestamps:false
  })
};