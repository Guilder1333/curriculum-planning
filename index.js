const nodemailer = require('nodemailer');
const validator = require("email-validator");
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const {mailParams} = require("./mail-account");
const app = express();
const PORT = process.env.PORT || 5000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, "dist")));

app.post('/api/register', (req, res) => {
  if (validator.validate(req.body.email)) {
    res.redirect('/register');
    let transporter = nodemailer.createTransport({
      host: mailParams.host,
      port: mailParams.port,
      secure: mailParams.secure,
      auth: {
        user: mailParams.user,
        pass: mailParams.pass
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Fred Foo 👻" <grani66@mail.ru>', // sender address
      to: req.body.email, // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world! Your name is ' + req.body.name, // plain text body
      html: '<b>Hello world?</b><br/>Your name is ' + req.body.name // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  } else {
    res.send("failed");
  }
});

app.listen(PORT, () => console.log("started on port " + PORT));