const { STRING, ENUM, INTEGER, TIME } = require("sequelize");

module.exports = sequelize=>{
  sequelize.define("activity",{
    name:{
      type:STRING(30),
      allowNull:false
    },
    day:{
      type: ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
      allowNull:false
    },
    start_time:{
      type:TIME,
      allowNull:false
    },
    end_time:{
      type:TIME,
      allowNull:false
    },
    // start_hour:{
    //   type: INTEGER,
    //   allowNull: false
    // },
    // start_minutes:{
    //   type: INTEGER,
    //   allowNull: false
    // },
    // end_hour:{
    //   type: INTEGER,
    //   allowNull: false
    // },
    // end_minutes:{
    //   type: INTEGER,
    //   allowNull: false
    // },
    instructor:{
      type:STRING(30),
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