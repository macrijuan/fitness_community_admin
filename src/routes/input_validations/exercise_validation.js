const { is_mandatory } = require("../../errors.js");

const nameValidation = ( name, errors ) => {
  if( typeof name !== 'string' || !name ) return errors.name = [ is_mandatory( "name" ) ];
  if( name.length > 30 ) errors.name = [ strict_length( "name", 3, 30 ) ];
};

const muscleValidation = ( muscle, errors ) => {
  if( typeof muscle !== 'string' || !muscle ) return errors.muscle = [ is_mandatory( "muscle" ) ];
  if( muscle.length > 30 ) errors.muscle = [ strict_length( "muscle", 3, 30 ) ];
};

const body_partValidation = ( body_part, errors ) => {
  if( typeof body_part !== 'string' || !body_part ) return errors.body_part = [ is_mandatory( "body_part" ) ];
  if( body_part.length > 30 ) errors.body_part = [ strict_length( "body_part", 3, 30 ) ];
};

const videoValidation = ( video, errors ) => {
  if( typeof video !== 'string' || !video ) return errors.video = [ is_mandatory( "video" ) ];
  if( video.length > 11500 ) errors.video = [ "The maximum character length allowed of 11500 has been exceeded." ];
};

module.exports = {
  nameValidation,
  muscleValidation,
  body_partValidation,
  videoValidation,
};