const nodemailer = require('nodemailer');
const {mailParams, rootURL} = require("./params");

class MailSender {
  sendPassword(email, password) {
    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Учебный план" <' + mailParams.from + '>', // sender address
      to: email, // list of receivers
      subject: 'Вход на сайт Составление учебного плана', // Subject line
      text: 'Ваша временный пароль для входа на сайт: ' + password, // plain text body
      html: '<div>Ваш временный пароль для входа на сайт:</div><div style="color:deepskyblue;background:white;padding:30px;font-size:22pt;">' + password + '</div>' // html body
    };
    this.sendMail(mailOptions);
  }

  sendConfirmation(email, id) {
    const url = rootURL + '/api/confirm_registration?email=' + email + '&id=' + id;
    let mailOptions = {
      from: '"Учебный план" <' + mailParams.from + '>', // sender address
      to: email, // list of receivers
      subject: 'Регистрация на сайте Составление учебного плана', // Subject line
      text: 'Ссылка для подтверждения регистрации и входа: ' + url, // plain text body
      html: '<div>Ссылка для подтверждения регистрации и входа:</div><div style="color:deepskyblue;background:white;padding:30px;font-size:22pt;">' + url + '</div>' // html body
    };
    this.sendMail(mailOptions);
  }

  sendMail(options) {
    let transporter = nodemailer.createTransport({
      host: mailParams.host,
      port: mailParams.port,
      secure: mailParams.secure,
      auth: {
        user: mailParams.user,
        pass: mailParams.pass
      }
    });

    // send mail with defined transport object
    transporter.sendMail(options, (error, info) => {
      if (error) {
        console.error("Failed to send mail: %s to %s", info ? info.messageId : "n/a", options.to);
        console.log(error);
        return;
      }
      console.log('Message sent: %s to %s', info.messageId, options.to);
    });
  }
}

module.exports = MailSender;