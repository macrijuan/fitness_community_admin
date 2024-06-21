const { Sequelize } = require('sequelize');
require("dotenv").config();
const dbConfig = require("./dbConfig.js");

let sequelize = process.env.ENVIORMENT === "live"
 ?new Sequelize( `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, dbConfig )
:new Sequelize( `postgres://${process.env.LOCAL_DB_USER}:${process.env.LOCAL_DB_PASSWORD}@${process.env.LOCAL_DB_HOST}:${process.env.LOCAL_DB_PORT}/${process.env.LOCAL_DB_NAME}`,{
  logging:false, native:false
})

const modelDefiners = [
  require("./models/Activity.js"),
  require("./models/Admin.js"),
  require("./models/Exercise.js"),
  require("./models/Option.js"),
  require("./models/Routine.js"),
  require("./models/Training_session.js"),
  require("./models/User.js")
];

modelDefiners.forEach(model => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => {
  return [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]
});
sequelize.models = Object.fromEntries(capsEntries);


const { Activity, Exercise, Training_session, Routine, User } = sequelize.models;

Activity.belongsToMany( User, { through:"user_activities", timestamps:false, onDelete: 'CASCADE' } );
User.belongsToMany( Activity, { through:"user_activities", timestamps:false, onDelete: 'CASCADE' } );

Exercise.belongsToMany( User, { through:"user_exercises", timestamps:false, onDelete: 'CASCADE' } );
User.belongsToMany( Exercise, { through:"user_exercises", timestamps:false, onDelete: 'CASCADE' } );

Training_session.belongsToMany( User, { through:"user_trainning_sessions", timestamps:false, onDelete: 'CASCADE' } );
User.belongsToMany( Training_session, { through:"user_trainning_sessions", timestamps:false, onDelete: 'CASCADE' } );

User.hasMany( Routine, { onDelete: 'CASCADE' } );
Routine.belongsTo( User, { onDelete: 'CASCADE' } );

Training_session.belongsToMany( Routine, { through:"routine_training_sessions", timestamps:false, onDelete: 'CASCADE' } );
Routine.belongsToMany( Training_session, { through:"routine_training_sessions", timestamps:false, onDelete: 'CASCADE' } );

module.exports = {
  ...sequelize.models,
  conn: sequelize
};