const sendMail = require("./index").sendMail;
const frontUrl = require("./index").frontUrl;

module.exports.sendForgetPasswordMail = sendForgetPasswordMail;
async function sendForgetPasswordMail({
  userMail,
  firstName,
  token,
  testFile,
}) {
  const data = {
    to: userMail,
    subject: "Réinitialisation de mot de passe",
    text: `Vous vennez de faire une demande pour réinitialiser votre mot de passe pour votre compte sur de site du DeVinci FabLab. Pour réinitialiser votre mot de passe, cliquez sur le lien ci-dessous.
    ${frontUrl}/auth/password/${token}`,
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

    <p>Vous vennez de faire une demande pour réinitialiser votre mot de passe pour votre compte sur de site du <a href="${frontUrl}">DeVinci FabLab</a>. Pour réinitialiser votre mot de passe, cliquez sur le bouton ci-dessous.</p>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
        <tbody>
            <tr>
                <td align="center">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tbody>
                            <tr>
                                <td><a href="${frontUrl}/auth/password/${token}" target="_blank">Vérifier votre email</a> </td>
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
