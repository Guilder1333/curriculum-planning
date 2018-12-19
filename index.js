const nodemailer = require('nodemailer');
const validator = require("email-validator");
const express = require("express");
const cookieParser = require('cookie-parser');
const path = require("path");
const bodyParser = require('body-parser');
const {mailParams, localizedMessages, duplicateUserRegistrationError} = require("./params");
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

  app.post('/api/check', async (req, res) => {
    // check cookies if user is logged in
    try {
      const db = DataBaseClient.create();
      if (await db.checkLoginInfo(req.cookies.id, req.cookies.uid)) {
        res.send({status: "ok"});
      } else {
        res.send({status: "failed"});
      }
    } catch (e) {
      res.status(500).send(e);
    }
  });
  app.post('/api/auth', async (req, res) => {
    // check if user exists to login or register
    try {
      if (validator.validate(req.body.email)) {
        const db = DataBaseClient.create();
        let result = await db.beginAuth(req.body.email);
        res.send({status: "ok", login: result.login, password: result.password});
        if (!result.password && result.code) {
          // TODO send mail with password
        }
      } else {
        res.send({status: "mailInvalid", message: localizedMessages.mailInvalid});
      }
    } catch (e) {
      res.status(500).send(e);
    }
  });
  app.post('/api/login', async (req, res) => {
    try {
      if (validator.validate(req.body.email)) {
        const db = DataBaseClient.create();
        let result = await db.login(req.body.email, req.body.password);
        if (result) {
          res.send({status: "ok", loginId: result.loginId, verifyGuid: result.verifyGuid});
        } else {
          res.send({status: "failed", loginId: null, verifyGuid: null});
        }
      } else {
        res.send({status: "mailInvalid", message: localizedMessages.mailInvalid});
      }
    } catch (e) {
      res.status(500).send(e);
    }
  });
  app.post('/api/register', (req, res) => {
    try {
      if (validator.validate(req.body.email)) {
        const db = DataBaseClient.create();
        const result = db.register(req.body.email, req.body.password, req.body.name, req.body.group, req.body.teacher, req.body.randomPassword);
        if (result) {
          res.send({status: "ok", loginId: result.loginId, verifyGuid: result.verifyGuid});
        } else {
          res.send({status: "failed", loginId: null, verifyGuid: null});
        }
      } else {
        res.send({status: "mailInvalid", message: localizedMessages.mailInvalid});
      }
    } catch (e) {
      if (e === duplicateUserRegistrationError) {
        res.send({status: "failed",  message: localizedMessages.duplicateUser});
      } else {
        res.stats(500).send(e);
      }
    }
  });

  app.listen(PORT, () => console.log("started on port " + PORT));
}

/*
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
 */