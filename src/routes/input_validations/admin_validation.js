const { is_mandatory, strict_length, strict_char_type, cant_contain, at_least_one, strict_size } = require("../../errors.js");
//passwordVal tests below.
const specChars = /^[@$!%*?&]{1,32}$/;//test 1
const lowercase = /^[a-zà-ÿ]{1,32}$/;//test 2
const uppercase = /^[A-ZÀ-Ý]{1,32}$/;//test 3
const number = /^[\d]{1,32}$/;//test 4

const emailVal = (email, errors)=>{
  if(typeof email !== "string"){
    errors.email = [ is_mandatory( "email" ) ];
  }else{
    if(email.length<7 || email.length>254)errors.email=["Entered email isn't valid."]
  };
};

const passwordVal = (password, conf_password, errors)=>{
  if(typeof password !== "string"){ errors.password=[ is_mandatory("Password") ]; return; };
  const approved = [];
  password.split("").forEach(e=>{
    if(specChars.test(e)&&!approved.includes(1)){approved.push(1)};
    if(lowercase.test(e)&&!approved.includes(2)){approved.push(2)};
    if(uppercase.test(e)&&!approved.includes(3)){approved.push(3)};
    if(number.test(e)&&!approved.includes(4)){approved.push(4)};
  });
  errors.password = [];
  if (!approved.includes(1))errors.password.push(at_least_one("password","of the following special characters inside the brackets (brackets not included) [ @ $ ! % * ? & ]"));
  if (!approved.includes(2))errors.password.push(at_least_one("password","lowercase letter"));
  if (!approved.includes(3))errors.password.push(at_least_one("password","uppercase letter"));
  if (!approved.includes(4))errors.password.push(at_least_one("password","number"));
  if (password.length<8 || password.length>35)errors.password.push(strict_length("password", 8, 35));
  if (password.split("").includes(" "))errors.password.push(cant_contain("password", "spaces"));
  if(password!==conf_password) errors.conf_password = [ "The entered passwords are not equal." ];
  if(!errors.password.length)delete errors.password;
};

const nameVal = ( name, errors, dataName )=>{
  const prop = dataName.replace(" ", "_");
  if(!name || typeof name !== "string" || !name.length){
    errors[prop] = [ is_mandatory(`${dataName}`) ];
  }else{
    if(name.length<2 || name.length>35)errors[prop][ strict_length(dataName, 2, 35) ];
  };
  // if(!errors[prop].length)delete errors[dataName.replace(" ", "_")];
};

const identityVal = ( identity, errors )=>{
  if(
    typeof identity !== "string"
    || !identity
  ){ errors.identity = [ is_mandatory("identity") ]; return; };
  identity = Number(identity);
  errors.identity = [];
  if( identity % 1 !== 0 )errors.identity.push( strict_char_type( "identity", "an integer number" ) );
  if( identity > 99999999 || identity < 1 ) errors.identity.push( strict_size( "identity", 1, 99999999 ) );
  if( !errors.identity.length )delete errors.identity;
};

const super_adminVal = ( data, errors ) => {
  if( !( data === "true" || data === "false" ) ) errors.super_admin = [ is_mandatory( "super_admin" ) ];
};


module.exports = {
  emailVal,
  passwordVal,
  nameVal,
  identityVal,
  super_adminVal
};