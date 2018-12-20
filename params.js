module.exports = {
  mailParams: {
    from: '',
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
    confirmationSalt: "&(lo~8z/Q^~(aMy0cUZeOoy]nCexce{4K/N2TTZ\"5Kl!TZCwtH[H@vkPmD2Y<Er"
  },
  rootURL: "localhost:5000",
  loginFailedError: 0x100001,
  duplicateUserRegistrationError: 0x100002,
  registrationFailedError: 0x100003,
  localizedMessages: {
    mailInvalid: "EMail имеет неверный формат",
    duplicateUser: "Пользователь с такой почтой уже существует. Войдите или вспользуйтесь восстановлением пароля."
  }
};