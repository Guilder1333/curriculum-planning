module.exports = {
  mailParams: {
    user: '',
    pass: '',
    host: 'smtp.mail.ru',
    port: 465,
    secure: true
  },
  databaseParams: {
    connectionString: "postgres://postgres:root@localhost:5432/studyplan",
    ssl: false,
    salt: "C%W<mIMjXAY+I>{",
  },
  loginFailedError: 0x100001,
  duplicateUserRegistrationError: 0x100002,
  registrationFailedError: 0x100003,
  localizedMessages: {
    mailInvalid: "EMail имеет неверный формат",
    duplicateUser: "Пользователь с такой почтой уже существует. Войдите или вспользуйтесь восстановлением пароля."
  }
};