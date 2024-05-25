// Sample mail
const sendSampleMail = require("./functions/sendMail/sample").sendSampleMail;
const email = "test@test.com";

sendSampleMail({
  userMail: email,
  text: "Bonjour ceci est un test de mail",
  testFile: "sampleMail.html",
});

// Register mail
const sendRegisterMail =
  require("./functions/sendMail/register").sendRegisterMail;

sendRegisterMail({
  userMail: email,
  firstName: "TestUser",
  token: "token",
  testFile: "registerPasswordMail.html",
});

// Forgot password mail
const sendForgetPasswordMail =
  require("./functions/sendMail/forgotPassword").sendForgetPasswordMail;

sendForgetPasswordMail({
  userMail: email,
  firstName: "TestUser",
  token: "token",
  testFile: "forgotPasswordMail.html",
});

// Password changed mail
const sendPasswordChangedMail =
  require("./functions/sendMail/passwordChanged").sendPasswordChangedMail;

sendPasswordChangedMail({
  userMail: email,
  firstName: "TestUser",
  token: "token",
  testFile: "passwordChanged.html",
});

// New message to ticket mail
const sendTicketMessageMail =
  require("./functions/sendMail/ticketMessage").sendTicketMessageMail;

const messages = [
  {
    userName: "Cody",
    content:
      "Bonjour Émile, est-ce que tu trouves que mon mail pour notifier les étudiants, qu'ils ont un nouveau message, est bien ?",
    creationDate: new Date(2002, 2, 16, 2, 45),
    isApplicant: 0,
  },
  {
    userName: "l_eg",
    content:
      "OMG, c'est trop bo. J'aimes tros le disigne ke je toffre 1 caskète du fab",
    creationDate: new Date(2022, 4, 5, 16, 23),
    isApplicant: 1,
  },
  {
    userName: "Cody",
    content: "Merci beaucoup, ca ! C'est très sympatique",
    creationDate: new Date(2015, 8, 29, 0, 16),
    isApplicant: 0,
  },
  {
    userName: "l_eg",
    content: "Pas de souss, tu le mérritent b1",
    creationDate: new Date(1985, 11, 14, 14, 12),
    isApplicant: 1,
  },
  {
    userName: "Cody",
    content: "Dimitry sort de se corps",
    creationDate: new Date(2048, 4, 24, 15, 48),
    isApplicant: 0,
  },
];
sendTicketMessageMail({
  userMail: email,
  ticketId: 212,
  messages,
  testFile: "ticketMessageMail.html",
});
