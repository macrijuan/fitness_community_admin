const serverless = require("serverless-http");
const express = require("express");
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const bodyParser = require("body-parser");
const server = express();

const routes = require("../../src/routes/index.js");
const key = require("../../src/routes/server_key.js");
// const sign_in = require("../src/routes/admin/post/sign_in.js");
// const signup_admin_req = require("../src/routes/admin/post/signup_admin_request.js");
// const reset_password = require("../src/routes/admin/update/reset_password.js");
// const authenticate = require("../src/routes/authenticate.js");
const { unknown, custom_error } = require("../../src/errors.js");

server.name = 'API';

const limitReached = {};


server.use(
  rateLimit({
    windowMs: 30000,
    max: 500,
    handler: (req, res ) => {
      if( !limitReached[ req.ip ] ){
        limitReached[ req.ip ] = true;
        setTimeout(()=>{
          delete limitReached[ req.ip ];
        }, req.rateLimit.resetTime - Date.now() );
        return res.status( 429 ).json( custom_error( 'req_limit', 'Too many requests, please try again later.' ) )
      };
      console.log('Request limit reached for IP:', req.ip);
    }
  })
);

  
server.use(async (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${res.statusCode} ${req.path} - ${Date.now() - start}ms`);
    console.log("__________________________");
  });
  setTimeout(()=>{
    next();
  }, 700 );
});

server.use(
  session({
  secret: key(),
  // secret: "secret_key",
  resave: false,
  saveUninitialized: false,
  name: 'fitcom.sid_encoded$',
  cookie: {
    maxAge: 7200000,//2hs
    secure: false,
    httpOnly: false,
    sameSite: 'strict',
    }
  })
);

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json({ limit: '50mb' }));

server.use(( req, res, next ) => {
  res.header('Access-Control-Allow-Origin', 'https://fitness-community-admin.vercel.app');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, X-Csrf-Token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  next();
});

server.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, X-Csrf-Token');
  res.status(200).end();
});

server.use( '/.netlify/functions/api', routes );
//sign_in, signup_admin_req, reset_password, authenticate, routes



server.use(( err, req, res, next ) => {
  console.error( err );
  console.log("ERROR ENDWARE");
  res.status( 500 ).json( unknown );
});

module.exports.handler = serverless(server);