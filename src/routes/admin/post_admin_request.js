const { Router } = require("express");
const router = Router();
const format = require("./controllers/format.js");
const existing = require("./controllers/existing.js");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { unknown } = require("../../errors.js");

router.put("/post_admin_request", 
  format,
  existing,
  async( req, res, next )=>{
    try{
      req.session.admin_req = {
        email:req.body.email,
        password:req.body.password,
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        identity:req.body.identity
      };
      req.session.csrf_token = crypto.randomBytes(64).toString('hex');
      req.session.approve_signup = crypto.randomBytes(64).toString('hex');
      res.setHeader( "x-csrf-token", req.session.csrf_token );
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'job.email.jami@gmail.com',
          pass: 'Lindurac123!'
        }
      });
      
      // Email content
      let mailOptions = {
        from: 'job.email.jami@gmail.com',//CHECK IF THE ROUTE WORKS
        to: 'amacri162013@yahoo.com',
        subject: 'New administrator sign up',
        html: `
          <h1>${req.body.first_name} ${req.body.last_name} wants to sign up as administrator</h1>
          <h3>This is the data...</h3>
          <ul>
            <li>Email: ${req.body.email}</li>
            <li>Identity: ${req.body.identity}</li>
          </ul>
          <h6>To proceed with the ${req.body.first_name} ${req.body.last_name} sign up, handle to the new administrator the code below.\n<h1>${req.session.csrf_token}</h1>
          </h6>
        `
      };
      
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
      res.json({message:"Sign up request sent. Await for the super administrator to review your "});
    }catch(err){
      console.log(err);
      res.status(500).json(unknown);
    };
  }
);

module.exports = router;