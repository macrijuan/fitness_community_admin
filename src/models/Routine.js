const { STRING, INTEGER } = require("sequelize");

module.exports = ( sequelize ) => {
  sequelize.define( 'routine', {
    name:{
      type:STRING,
      unique:true,
      allowNull:false
    },
    start_day:{
      type:INTEGER,
      validate:{
        max:31, min:1
      }
    }
  },{
    timestamps:false
  })
};