const serverless = require("serverless-http");
const express = require("express");
const rateLimit = require('express-rate-limit');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const server = express();

const routes = require("../../src/routes/index.js");
// const key = require("../../src/routes/server_key.js");
const sign_in = require("../../src/routes/admin/post/sign_in.js");
const signup_admin_req = require("../../src/routes/admin/post/signup_admin_request.js");
const reset_password = require("../../src/routes/admin/update/reset_password.js");
const session_getter = require("../../src/routes/session_getter.js");
const authenticate = require("../../src/routes/authenticate.js");
const { unknown, req_limit } = require("../../src/errors.js");

server.name = 'API';

const limitReached = new Set();

server.set('trust proxy', true);

server.use(
  rateLimit({
    windowMs: 900000,
    max: 500,
    handler: (req, res ) => {
      if( !limitReached.has( req.ip ) ){
        console.log("add limitted ip");
        limitReached.add( req.ip );
        setTimeout(()=>{
          limitReached.delete( req.ip );
        }, req.rateLimit.resetTime - Date.now() );
        return res.status( 429 ).json( req_limit );
      };
      console.log('Request limit reached for IP:', req.ip);
      res.end();
    },
    keyGenerator: (req) => {
      req.ip = req.headers['x-forwarded-for']?.split(',')[0].trim();
      return req.ip;
    }
  })
);

// server.use(async (req, res, next) => {
//   const start = Date.now();
//   res.on('finish', () => {
//     console.log(`${req.method} ${res.statusCode} ${req.path} - ${Date.now() - start}ms`);
//     console.log("__________________________");
//   });
//   setTimeout(()=>{
//     next();
//   }, 700 );
// });

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use( cookieParser() );

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

server.use( '/.netlify/functions/api', sign_in, signup_admin_req, reset_password, session_getter, authenticate, routes );

server.use(( err, req, res, next ) => {
  console.error( err );
  console.log("ERROR ENDWARE");
  res.status( 500 ).json( unknown );
});

module.exports.handler = serverless(server);