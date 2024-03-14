const express = require("express");
const session = require('express-session');
const app = express();
const routes = require("../../src/routes/index.js");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");

const { conn } = require("../../src/db.js");
const key = require("../src/routes/server_key.js");

server.use(( req, res, next )=>{
  if(!req.secure){
    console.log(req);
    res.status(403).json(custom_error( "notSecure", "Connection is not secure." ));
  }else{
    next();
  };
});

server.use(session({
  secret: key(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000,
    secure: true,
  }
}));

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'YOUR ORIGIN');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use("/.netlify/functions/api",
(req, res, next)=>{
  conn.authenticate().then(()=>{next();}).catch(()=>{res.send("DB connection failed.");});
},
routes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports.handler = serverless(app);