const { STRING, INTEGER, ENUM, BOOLEAN, UUID, UUIDV1 } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define('user',{
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
    nickname:{
      type:STRING(30),
      allowNull:false
    },
    sex:{
      type:ENUM("male", "female"),
      allowNull:false
    },
    age:{
      type:INTEGER,
      allowNull:false
    },
    isTrainer:{
      type:BOOLEAN,
      defaultValue:false,
      allowNull:false
    },
    reset_token:{
      type:STRING,
      validate:{
        len:[ 6, 6 ]
      }
    }
  });
};