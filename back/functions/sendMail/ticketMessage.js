const sendMail = require("./index").sendMail;
const frontUrl = require("./index").frontUrl;
const format = require("../date").format;

function setZero(number = 0) {
  if (number < 10) {
    return "000" + number;
  } else if (number < 100) {
    return "00" + number;
  } else if (number < 1000) {
    return "0" + number;
  } else {
    return number;
  }
}

module.exports.sendTicketMessageMail = sendTicketMessageMail;
async function sendTicketMessageMail({
  userMail,
  ticketId,
  messages,
  testFile,
}) {
  const ticketIdText = setZero(ticketId);
  const chatHtml = await new Promise((resolve, reject) => {
    let result = "";
    for (let index = 0; index < messages.length; index++) {
      const message = messages[index];
      result =
        result +
        `<tr>
          <td align="${message.isApplicant ? "right" : "left"}">
            <div class="chat-bubble ${
              message.isApplicant ? "chat-applicant" : "chat-agent"
            }${index == messages.length - 1 ? " chat-new" : ""}">
              <div class="metadata">
                <strong class="user">${
                  message.isApplicant ? "Vous" : message.userName
                }</strong>
                <p class="date">${format(message.creationDate, "fr")}</p>
              </div>
              <p>${message.content}</p>
            </div>
          </td>
        </tr>`;
    }
    resolve(result);
  });
  const data = {
    to: userMail,
    subject: `Nouveau message pour l'impression #${ticketIdText}`,
    text: `Vous avez un nouveau message pour votre demande #${ticketIdText} sur de site du ${frontUrl}.`,
    html: `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="padding-bottom: 10px">
      <tr>
        <td>
          <h1>Nouveau message #${ticketIdText}</h1>
        </td>
        <td style="text-align: right;">
          <img src="${frontUrl}/logo.png" alt="Image" style="width: 100%; max-width: 200px; height: auto; margin-right: 10px; display: inline-block; vertical-align: middle;">
        </td>
      </tr>
    </table>

    <p>Vous avez recu un nouveau message pour votre demande d'impression #${ticketIdText}. Vous pouvez voir votre demande ici : <a href="${frontUrl}/panel/${ticketId}">voir la demande</a>.</p>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
      <tbody>
        ${chatHtml}
      </tbody>
    </table>
    <p>Si vous avez des problèmes, merci de contacter directement un membre de l'association.</p>
    <p>À très vite,</p>`,
    testFile,
  };
  return sendMail(data);
}
