const { Sequelize } = require('sequelize');
require("dotenv").config();
const dbConfig = require("./dbConfig.js");

let sequelize = new Sequelize( `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`, dbConfig );

const modelDefiners = [
  require("./models/Activity.js"),
  require("./models/Exercise.js"),
  require("./models/Routine.js"),
  require("./models/User.js"),
];

modelDefiners.forEach(model => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => {
  return [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]
});
sequelize.models = Object.fromEntries(capsEntries);


const { Activity, Exercise, Routine, User } = sequelize.models;

User.belongsToMany( Activity, { through:"user_activities", timestamps:false } );
Activity.belongsToMany( User, { through:"user_activities", timestamps:false } );

User.belongsToMany( Routine, { through:"user_routine", timestamps:false } );
Routine.belongsToMany( User, { through:"user_routine", timestamps:false } );

User.belongsToMany( Exercise, { through:"user_exercises", timestamps:false } );
Exercise.belongsToMany( User, { through:"user_exercises", timestamps:false } );


module.exports = {
  ...sequelize.models,
  conn: sequelize,
};