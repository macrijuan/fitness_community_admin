const { STRING, INTEGER, BOOLEAN, DATEONLY } = require("sequelize");

// function convertUTCISOToDateOnly() {
//   const date = new Date();
//   const year = date.getUTCFullYear();
//   const month = String(date.getUTCMonth() + 1).padStart(2, '0');
//   const day = String(date.getUTCDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// }

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
    super_admin:{
      type:BOOLEAN,
      defaultValue:false,
      allowNull:false
    },
    created: {
      type: DATEONLY,
      defaultValue: new Date().toISOString()
    },
    updated: {
      type: DATEONLY,
      defaultValue: new Date().toISOString()
    }
  },{
    timestamps:false
  });
};