const { Router } = require("express");
const router = Router();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const reqLimit = require("express-rate-limit");

const format = require("../controllers/format.js");
const existing = require("../controllers/existing.js");
const { custom_error, req_limit } = require("../../../errors.js");
const { get_signup_count, add_signup, del_signup } = require("../post/cookie_admin_signup_req.js");

require("dotenv").config();
const { EMAIL_HOST, EMAIL_PORT, EMAIL_HOST_P, EMAIL_USER, EMAIL_RECEPTOR } = process.env;


router.put("/signup_admin_request",
reqLimit({
  windowMs:3600000,
  max:3,
  message:req_limit
}),
( req, res, next ) => {
  if(get_signup_count() > 5){
    res.status( 429 ).json( custom_error( "signup_cap", "We have reached our max sign up requests capacity. Please try again in 2hs." ) );
  }else{
    next();
  };
},
format,
existing,
async( req, res )=>{
  try{
    // res.locals.signup_code = crypto.randomBytes(32).toString('hex');
    res.locals.signup_code = "signup";
    add_signup({
      data:{
        email:req.body.email,
        password:req.body.password,
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        identity:req.body.identity
      },
      signup_code:res.locals.signup_code,
    });

    setTimeout(() => {
      del_signup( res.locals.signup_code );
    }, 3600000);

      // console.log({
      //   host: EMAIL_HOST,
      //   port: parseInt(EMAIL_PORT),
      //   secure: false, // true for 465, false for other ports
      //   auth: {
      //     user: EMAIL_USER,
      //     pass: EMAIL_HOST_P
      //   }
      // });

      const transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: parseInt(EMAIL_PORT),//465
        secure: true, // true for 465, false for other ports
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_HOST_P
        },
        tls:{
          rejectUnauthorized:true
        }
      });
      
      const mailOptions = {
        from: EMAIL_USER,
        to: EMAIL_RECEPTOR,
        subject: 'Fitness Community: NEW administrator SIGN UP request.',
        html: `
          <h1>${req.body.first_name} ${req.body.last_name} wants to sign up as administrator</h1>
          <h2>This is the data...</h2>
          <ul>
            <li><h3>Email: ${req.body.email}</h3></li>
            <li><h3>Identity: ${req.body.identity}</h3></li>
          </ul>
          <h4>If you want to give administrator permissions to ${req.body.first_name} ${req.body.last_name} copy the code below. Then click the "Accept" button. Otherwise, click the "Deny" button.</h4>
          <h1>${res.locals.signup_code}</h1>
          <a href="https://molinorestobar.vercel.app" target="_blank"><button>Accept</button></a>
          <a href="https://google.com.ar/maps" target="_blank"><button>Deny</button></a>
          `
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          res.status(500).json(custom_error("unknown", "Oh, no! There was an error while sending the sign up request. Please try later."));
        } else {
          console.log('Email sent:', info.response);
          res.json({message:"Sign up request sent. Await for the super administrator to review your sign up application."});
        };
      });
    }catch(err){
      next( err );
    };
  }
);

router.get("/test",(req,res)=>{
  res.json(Object.keys);
});


module.exports = router;