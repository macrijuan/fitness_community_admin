const { UUID, UUIDV4, INTEGER, TIME } = require("sequelize");

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
    },
    expiresAt:{
      type:TIME
    }
  },{
    timestamps:false
  });
};