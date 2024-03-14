const { UUID, UUIDV4, INTEGER, TIME } = require("sequelize");

module.exports = sequelize=>{
  sequelize.define("admin_session",{
    token:{
      type:UUID,
      primaryKey:true,
      unique:true,
      defaultValue:UUIDV4
    },
    adminId:{
      type:INTEGER
    },
    expiresAt:{
      type:TIME
    }
  },{
    timestamps:false
  });
};