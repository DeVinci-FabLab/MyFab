const sendMail = require("./index").sendMail;
const frontUrl = require("./index").frontUrl;

module.exports.sendNotifyNewEmail = sendNotifyNewEmail;
async function sendNotifyNewEmail({
  emailList,
  ticketId,
  projectMaterial,
  testFile,
}) {
  const data = {
    bcc: emailList,
    subject: `#${ticketId} Une nouvelle demande ${projectMaterial} vient d'être créé sur MyFab`,
    text: `Une nouvelle demande ${projectMaterial} vient d'être créé sur MyFab`,
    html: `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="padding-bottom: 10px">
        <tr>
            <td>
                <h1>Bonjour</h1>
            </td>
            <td style="text-align: right;">
                <img src="${frontUrl}/logo.png" alt="Image" style="width: 100%; max-width: 200px; height: auto; margin-right: 10px; display: inline-block; vertical-align: middle;">
            </td>
        </tr>
    </table>

    <p>Une nouvelle demande d'impression 3D ${projectMaterial} vient d'être créé sur MyFab. Il s'agit du ticket #${ticketId}</p>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
        <tbody>
            <tr>
                <td align="center">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tbody>
                            <tr>
                                <td><a href="${frontUrl}/panel/${ticketId}" target="_blank">Voir le ticket</a> </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
    <p>À très vite,</p>`,
    testFile,
  };
  return sendMail(data);
}
