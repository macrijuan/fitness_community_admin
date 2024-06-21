const { STRING } = require("sequelize");

module.exports = sequelize=>{
  sequelize.define("exercise",{
    name:{
      type:STRING(30),
      allowNull:false,
      unique:true
    },
    muscle:{
      type:STRING(30),
      allowNull:false
    },
    body_part:{
      type:STRING(30),
      allowNull:false
    },
    video:{
      type:STRING(11500),
      allowNull:false,
      unique:true
    }
  },{
    timestamps:false
  });
};