// Sample mail
const sendSampleMail = require("./functions/sendMail/sample").sendSampleMail;

sendSampleMail({
  userMail: "Test@mail.fr",
  text: "Bonjour ceci est un test de mail",
  testFile: "sampleMail.html",
});

// Register mail
const sendRegisterMail =
  require("./functions/sendMail/register").sendRegisterMail;

sendRegisterMail({
  userMail: "Test@mail.fr",
  firstName: "TestUser",
  token: "token",
  testFile: "registerPasswordMail.html",
});

// Forgot password mail
const sendForgetPasswordMail =
  require("./functions/sendMail/forgotPassword").sendForgetPasswordMail;

sendForgetPasswordMail({
  userMail: "Test@mail.fr",
  firstName: "TestUser",
  token: "token",
  testFile: "forgotPasswordMail.html",
});
