const sendMail = require("./index").sendMail;
const frontUrl = require("./index").frontUrl;

module.exports.sendSampleMail = sendSampleMail;
async function sendSampleMail({ userMail, text, testFile }) {
  const data = {
    to: userMail,
    subject: "Insciption DeVinci FabLab",
    text,
    html: `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="padding-bottom: 10px">
      <tr>
        <td>
          <h1>Ceci est un test pour les mails</h1>
        </td>
        <td style="text-align: right;">
          <img src="${frontUrl}/logo.png" alt="Image" style="width: 100%; max-width: 200px; height: auto; margin-right: 10px; display: inline-block; vertical-align: middle;">
        </td>
      </tr>
    </table>
    ${text}`,
    testFile,
  };
  return sendMail(data);
}
