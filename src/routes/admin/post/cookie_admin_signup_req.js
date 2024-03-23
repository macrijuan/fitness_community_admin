let admin_signup_reqs = [];

setInterval(()=>{
  admin_signup_reqs = [];
},86400000);

const add_signup = (data)=>admin_signup_reqs.push(data);
const del_signup = (id)=>admin_signup_reqs.splice(t.findIndex((e)=>e.code===id), 1);
const get_signup = (code) => code ?admin_signup_reqs.find(e=>e.signup_code===code) :admin_signup_reqs;
const get_signup_count = ()=>admin_signup_reqs.length;


module.exports = {
  add_signup,
  del_signup,
  get_signup,
  get_signup_count
};