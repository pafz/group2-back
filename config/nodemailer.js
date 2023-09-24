const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

if (process.env.NODE_ENV === 'testing') {
  transporter = {
    sendMail: email => {
      console.log('Testing ee to:', email.to);
    },
  };
}

const mailOptions = {
  from: 'SENDER-EMAIL',
  to: 'RECIPIENT-EMAIL',
  subject: 'SUBJECT',
  text: 'EMAIL BODY',
};

module.exports = transporter;
