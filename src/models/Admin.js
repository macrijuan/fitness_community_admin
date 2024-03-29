const { STRING, INTEGER, BOOLEAN } = require("sequelize");

module.exports = sequelize => {
  sequelize.define("admin",{
    email:{
      type:STRING(254),
      allowNull:false
    },
    password:{
      type:STRING(500),
      allowNull:false
    },
    first_name:{
      type:STRING(35),
      allowNull:false
    },
    last_name:{
      type:STRING(35),
      allowNull:false
    },
    identity:{
      type:INTEGER,
      allowNull:false,
      unique:true
    },
    superAdmin:{
      type:BOOLEAN,
      defaultValue:false,
      allowNull:false
    }
  });
};