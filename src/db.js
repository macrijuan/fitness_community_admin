const { Sequelize } = require('sequelize');
require("dotenv").config();
const dbConfig = require("./dbConfig.js");

// console.log(`postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

let sequelize = process.env.ENVIORMENT === "live"
 ?new Sequelize( `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, dbConfig )
:new Sequelize( `postgres://${process.env.LOCAL_DB_USER}:${process.env.LOCAL_DB_PASSWORD}@${process.env.LOCAL_DB_HOST}:${process.env.LOCAL_DB_PORT}/${process.env.LOCAL_DB_NAME}`,{
  logging:false, native:false
})

const modelDefiners = [
  require("./models/Activity.js"),
  require("./models/Admin.js"),
  // require("./models/Admin_session.js"),
  require("./models/Exercise.js"),
  require("./models/Routine.js"),
  require("./models/User.js"),
  // require("./models/User_session.js"),
  require("./models/Option.js")
];

modelDefiners.forEach(model => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => {
  return [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]
});
sequelize.models = Object.fromEntries(capsEntries);


const { Activity, Exercise, Routine, User } = sequelize.models;

Activity.belongsToMany( User, { through:"user_activities", timestamps:false } );
User.belongsToMany( Activity, { through:"user_activities", timestamps:false } );

Exercise.belongsToMany( User, { through:"user_exercises", timestamps:false } );
User.belongsToMany( Exercise, { through:"user_exercises", timestamps:false } );

Routine.belongsToMany( User, { through:"user_routines", timestamps:false } );
User.belongsToMany( Routine, { through:"user_routines", timestamps:false } );

// console.log(sequelize.models);

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};