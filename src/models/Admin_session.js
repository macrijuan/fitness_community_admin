const { UUID, UUIDV4, INTEGER } = require("sequelize");

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
    }
  },{
    timestamps:false
  });
};