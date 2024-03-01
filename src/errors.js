module.exports={
  unknown: { unknown:"An unknown error occured." },
  multi_errors: (data)=>{ return {errors:data}; },
  custom_error: ( dataName, data )=>{ return { errors:{ [dataName]:data } }; },
  not_found: ( dataName )=>{return {notFound:dataName+" not found."}},
  is_mandatory: ( dataName )=>`The ${dataName} field is mandatory`,
  strict_length: ( dataName, min, max )=>`The ${dataName} field must contain between ${min} and ${max} characters.`,
  strict_size: ( dataName, min, max )=>`The ${dataName} value must be between ${min} and ${max}.`,
  strict_char_type: ( dataName, types ) =>`The ${dataName} field can only contain ${types}.`,
  at_least_one: ( dataName, data )=>`The ${dataName} field must contain at least one ${data}.`,
  cant_contain: ( dataName, data )=>`The ${dataName} field can't contain ${data}.`,
  existing: ( data )=>`This ${data} is already registered.`,
  wrong_data_type: ( dataName, expected, recived, index )=>`${dataName}'s data type  --> expected: ${expected} --> recived: ${recived}.${index ?`Index: ${index}` :""}`,
};