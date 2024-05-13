const nodemailer = require("nodemailer");
require("dotenv").config();
const { EMAIL_HOST, EMAIL_PORT, EMAIL_HOST_P, EMAIL_USER } = process.env;

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: parseInt(EMAIL_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_HOST_P
  },
  tls:{
    rejectUnauthorized:false
  }
});

module.exports = transporter;