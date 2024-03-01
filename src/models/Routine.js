const { STRING, ARRAY, INTEGER } = require("sequelize");

module.exports = sequelize=>{
  sequelize.define("routine",{
    name:{
      type:STRING(30),
      allowNull:false
    },
    day:{
      type:INTEGER,
      allowNull:false
    },
    // creator:{
    //   type: STRING(30),
    //   allowNull:false
    // },
    // tag:{
    //   type:ARRAY(STRING),
    //   allowNull:false
    // },
    note:{
      type:STRING(700)
    }
  });
};