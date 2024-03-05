const { UUID, UUIDV4, INTEGER } = require("sequelize");

module.exports = sequelize=>{
  sequelize.define("user_session",{
    token:{
      type:UUID,
      primaryKey:true,
      unique:true,
      defaultValue:UUIDV4
    },
    userId:{
      type:INTEGER
    }
  },{
    timestamps:false
  });
};