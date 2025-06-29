const sendMail = require("./index").sendMail;
const frontUrl = require("./index").frontUrl;

module.exports.sendPasswordChangedMail = sendPasswordChangedMail;
async function sendPasswordChangedMail({ userMail, firstName, testFile }) {
  const data = {
    to: userMail,
    subject: "Réinitialisation de mot de passe",
    text: `Votre mot de passe à été modifié sur de site du DeVinci FabLab. Si vous n'êtes pas à l'origine de ce changement, nous vous invitons à changer votre mot de passe.`,
    html: `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="padding-bottom: 10px">
        <tr>
            <td>
                <h1>Bonjour ${firstName}</h1>
            </td>
            <td style="text-align: right;">
                <img src="${frontUrl}/logo.png" alt="Image" style="width: 100%; max-width: 200px; height: auto; margin-right: 10px; display: inline-block; vertical-align: middle;">
            </td>
        </tr>
    </table>

    <p>Votre mot de passe à été modifié sur de site du <a href="${frontUrl}">DeVinci FabLab</a>. Si vous n'êtes pas à l'origine de ce changement, nous vous invitons à changer votre mot de passe.</p>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
        <tbody>
            <tr>
                <td align="center">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tbody>
                            <tr>
                                <td><a href="${frontUrl}" target="_blank">Accéder au site</a> </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
    <p>Si vous avez des problèmes avec le lien merci de contacter directement un membre de l'association.</p>
    <p>À très vite,</p>`,
    testFile,
  };
  return sendMail(data);
}
