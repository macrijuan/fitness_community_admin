const { Router } = require("express");
const router = Router();
const rateLimit = require('express-rate-limit');
const transporter = require("../../nodemailer/transporter.js");
const { randomBytes } = require("crypto");
const { hash, argon2i } = require("argon2");
const { req_limit, not_found, custom_error, unknown, multi_errors } = require("../../../errors.js");
const { passwordVal } = require("../../input_validations/admin_validation.js");

require("dotenv").config();
const { EMAIL_USER } = process.env;

const { Admin } = require("../../../db.js");

const limitReached = new Set();

router.put( "/admin/reset_password",
rateLimit({
  windowMs: 900000,
  max: 3,
  handler: ( req, res ) => {
    if( !limitReached.has( req.ip ) ){
        limitReached.add( req.ip );
        setTimeout(()=>{
          limitReached.delete( req.ip );
        }, req.rateLimit.resetTime - Date.now() );
        return res.status( 429 ).json( req_limit )
      };
      console.log('Request limit reached for IP:', req.ip);
    }
  }),
  async( req, res, next ) => {
    try{
      if( req.body.email ){
        const admin = await Admin.findOne( { where:{ email:req.body.email } } );
        if( admin ){
          let token = undefined;
          if( !admin.reset_token ){
            token = randomBytes( 10 ).toString( 'hex' );
            if( token.length > 6 ) token = token.substring( 0, 6 );
            await admin.update({ reset_token:"token1" });
          };

          const mailOptions =  {
            from: EMAIL_USER,
            to: req.body.email,
            subject: 'Fitness Community: reset password token',
            html: `
              <h1>This is the token to reset your password.</h1>
              <h2>Copy and paste it in the form to confirm your identity and finish the password reset process.</h2>
              <h1>${ admin.reset_token || token }</h1>
            `
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error sending email:', error);
              res.status(500).json(unknown);
            } else {
              console.log('Email sent:', info.response);
              res.sendStatus( 204 );
            };
          });

          setTimeout( async() => {
            await admin.update({ reset_token:null }) ;
          }, 900000 );
        }else{
          res.status( 404 ).json( not_found( "Administrator") );
        };
      };
    }catch( err ){
      next( err );
    };
  }
);

router.put( '/admin/check_password_reset',
  rateLimit({
    windowMs: 600000,
    max: 3,
    handler: ( req, res ) => {
      if( !limitReached.has( req.ip ) ){
        limitReached.add( req.ip );
        setTimeout(()=>{
          limitReached.delete( req.ip );
        }, req.rateLimit.resetTime - Date.now() );
        return res.status( 429 ).json( req_limit )
      };
      console.log('Request limit reached for IP:', req.ip);
    }
  }),
  async( req, res, next ) => {
    try{
      if( req.body.email ){
        const admin = await Admin.findOne({ where:{ email:req.body.email } });
        if( admin ){
          if( admin.reset_token && admin.reset_token === req.body.reset_token ){
            const errors = {};
            passwordVal( req.body.password, req.body.conf_password, errors );
            if( Object.keys( errors).length ){
              res.status( 400 ).json( multi_errors( errors ) );
              return;
            };
            await admin.update({ 
              reset_token:null,
              password:await hash( admin.password, { type:argon2i } ).then(str=>str.slice( 30,str.length ) )
            });
            res.sendStatus( 204 );
          }else{
            res.status( 400 ).json( custom_error( 'reset_token', [ 'The token is not valid' ] ) );
          };
        }else{
          res.status( 404 ).json( not_found( "Administrator" ) );
        };
      };
    }catch( err ){
      next( err );
    };
  }
);

module.exports = router;