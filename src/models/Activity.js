const { STRING, ENUM, INTEGER } = require("sequelize");

module.exports = sequelize=>{
  sequelize.define("activity",{
    name:{
      type:STRING(30),
      allowNull:false
    },
    day:{
      type:INTEGER,
      allowNull:false
    },
    hour:{
      type:INTEGER,
      allowNull:false
    },
    minutes:{
      type:INTEGER,
      allowNull:false
    },
    teacher:{
      type:STRING(20),
      allowNull:false
    },
    description:{
      type:STRING(255),
      allowNull:false
    },
    tag:{
      type:ENUM('sport', 'muscle training', 'dance', 'fight'),
      allowNull:false
    }
  },{
    timestamps:false
  });
};