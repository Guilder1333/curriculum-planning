const nodemailer = require('nodemailer');
const validator = require("email-validator");
const express = require("express");
const cookieParser = require('cookie-parser');
const path = require("path");
const bodyParser = require('body-parser');
const {mailParams} = require("./mail-account");
const DataBaseClient = require("./database");
const PORT = process.env.PORT || 5000;

(function init() {
  const db = DataBaseClient.create();
  db.createDatabase().then(() => {
    console.log("database ok");
    initWebServer();
  }).catch((err) => {
    console.error(err);
  });
})();


function initWebServer() {
  const app = express();
// parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
  app.use(bodyParser.json());
  app.use(cookieParser());

  app.use('/', express.static(path.join(__dirname, "dist")));

  app.post('/api/login', async (req, res) => {
    const db = DataBaseClient.create();
    switch (req.body.stage) {
      case "check":
        try {
          if (await db.checkLoginInfo(req.cookies.id, req.cookies.uid)) {
            res.send({status: "auth"});
          } else {
            res.send({status: "fail", message: "Login required"});
          }
        } catch (e) {
          res.status(500).send(e);
        }
        return;
      case "email":
        try {
          if (validator.validate(req.body.email)) {
            db.beginAuth(req.body.email);
          } else {
            res.send({status: "mailInvalid", message: "Mail is invalid"});
          }
        } catch (e) {
          res.status(500).send(e);
        }
        break;
      case "password":
        break;
    }
    console.log(req.query);
    res.send("ok");
  });

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
}