const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors())
app.use(express.json()); // Parse incoming JSON data

app.post('/send-email', (req, res) => {
  const { to, subject, htmlText } = req.body;

  const transporter = nodemailer.createTransport({
    //mailing config
    //mailing config
    service: process.env.SERVICE_NAME,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'librantlib@gmail.com',
    to: to,
    subject: subject,
    html: htmlText,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to send email' });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Email sent successfully' });
    }
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});