const { STRING, INTEGER } = require("sequelize");

module.exports = sequelize=>{
  sequelize.define("training_session",{
    name:{
      type:STRING(30),
      allowNull:false
    },
    day:{
      type:INTEGER,
      allowNull:false
    },
    note:{
      type:STRING(700)
    }
  });
};