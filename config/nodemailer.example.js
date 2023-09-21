const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        email: 'your gmail email',
        pass: 'goolge password generated'
    }
});


module.exports = {transporter}; 