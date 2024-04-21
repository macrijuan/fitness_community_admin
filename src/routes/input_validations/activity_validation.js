const { is_mandatory, strict_length, cant_contain } = require("../../errors.js");
const errs = require("../../errors.js");
const { Activity } = require("../../db.js");

function nameValidation( name, errors, dataName ){
  if( typeof name !== 'string' || !name ){
    errors[ dataName ] = [ is_mandatory( dataName ) ];
    return;
  };
  if( name.length <3 || name.length > 30 ) errors[ dataName ] = [ strict_length( dataName, 3, 30 ) ];
};

function dayValidation( day, errors ){
  if(
    typeof day !== 'string'
    || !day
    || !Activity.rawAttributes.day.type.values.includes( day )
  ) errors.day = [ is_mandatory( "day" ) ];
};

function timeValidation( time, errors, dataName ){
  if( 
    typeof time !== 'string'
    || !time
    || !( /^[.\d]{2}:[\d]{2}$/ ).test( time )
  ) return errors[ dataName ] = [ is_mandatory( dataName ) ];
  const data = time.split( ":" );
  if(
    data[ 0 ] > 24 || data[ 0 ] < 0
    || data[ 1 ] > 60 || data[ 1 ] < 0
  ) errors[ dataName ] = [ is_mandatory( dataName ) ];
};

function descrValidation( descr, errors ){
  if( typeof descr !== 'string' ){
    errors.description = [ is_mandatory( "description" ) ];
    return;
  };
  if(  descr.length > 255 ) errors.description = [ cant_contain( "description", "more than 255 characters." ) ];
};

function tagValidation( tag, errors ){
  if(
    typeof tag !== 'string'
    || !tag
    || !Activity.rawAttributes.tag.type.values.includes( tag )
  ) errors.tag = [ is_mandatory( "tag" ) ];
};

module.exports = {
  nameValidation,
  dayValidation,
  timeValidation,
  descrValidation,
  tagValidation
};