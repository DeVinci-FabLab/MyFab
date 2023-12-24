const nodemailer = require("nodemailer");
const fs = require("fs");
require("dotenv").config();
const frontUrl = process.env.FRONT_URL;

const pathToDkim = __dirname + "/../data/dkim_private.pem";
const dkim = fs.existsSync(pathToDkim)
  ? {
      domainName: process.env.MAIL_USER.split("@")[1],
      selector: process.env.MAIL_USER.split("@")[0],
      privateKey: require(pathToDkim),
    }
  : null;

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  dkim,
});

function writeEmail(body) {
  return `<!doctype html>
	<html lang="en">
	  <head>
	    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	    <title>DeVinci FabLab Email Template</title>
	    <style media="all" type="text/css">
      /* -------------------------------------
	    GLOBAL RESETS
	------------------------------------- */

      body {
        font-family: Helvetica, sans-serif;
        -webkit-font-smoothing: antialiased;
        font-size: 16px;
        line-height: 1.3;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
      }

      table {
        border-collapse: separate;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        width: 100%;
      }

      table td {
        font-family: Helvetica, sans-serif;
        font-size: 16px;
        vertical-align: top;
      }
      /* -------------------------------------
	    BODY & CONTAINER
	------------------------------------- */

      body {
        background-color: #f4f5f6;
        margin: 0;
        padding: 0;
      }

      .body {
        background-color: #f4f5f6;
        width: 100%;
      }

      .container {
        margin: 0 auto !important;
        max-width: 600px;
        padding: 0;
        padding-top: 24px;
        width: 600px;
      }

      .content {
        box-sizing: border-box;
        display: block;
        margin: 0 auto;
        max-width: 600px;
        padding: 0;
      }
      /* -------------------------------------
	    HEADER, FOOTER, MAIN
	------------------------------------- */

      .main {
        background: #ffffff;
        border: 1px solid #eaebed;
        border-radius: 16px;
        width: 100%;
      }

      .wrapper {
        box-sizing: border-box;
        padding: 24px;
      }

      .footer {
        clear: both;
        padding-top: 24px;
        text-align: center;
        width: 100%;
      }

      .footer td,
      .footer p,
      .footer span,
      .footer a {
        color: #9a9ea6;
        font-size: 16px;
        text-align: center;
      }
      /* -------------------------------------
	    TYPOGRAPHY
	------------------------------------- */

      p {
        font-family: Helvetica, sans-serif;
        font-size: 16px;
        font-weight: normal;
        margin: 0;
        margin-bottom: 16px;
      }

      a {
        color: #0867ec;
        text-decoration: underline;
      }
      /* -------------------------------------
	    BUTTONS
	------------------------------------- */

      .btn {
        box-sizing: border-box;
        min-width: 100% !important;
        width: 100%;
      }

      .btn > tbody > tr > td {
        padding-bottom: 16px;
      }

      .btn table {
        width: auto;
      }

      .btn table td {
        background-color: #ffffff;
        border-radius: 4px;
        text-align: center;
      }

      .btn a {
        background-color: #ffffff;
        border: solid 2px #0867ec;
        border-radius: 4px;
        box-sizing: border-box;
        color: #0867ec;
        cursor: pointer;
        display: inline-block;
        font-size: 16px;
        font-weight: bold;
        margin: 0;
        padding: 12px 24px;
        text-decoration: none;
        text-transform: capitalize;
      }

      .btn-primary table td {
        background-color: #0867ec;
      }

      .btn-primary a {
        background-color: rgb(8, 150, 181);
        border-color: rgb(8, 150, 181);
        color: #ffffff;
      }

      @media all {
        .btn-primary table td:hover {
          background-color: rgb(212, 26, 95) !important;
        }
        .btn-primary a:hover {
          background-color: rgb(212, 26, 95) !important;
          border-color: rgb(212, 26, 95) !important;
        }
      }

      /* -------------------------------------
	    OTHER STYLES THAT MIGHT BE USEFUL
	------------------------------------- */

      .last {
        margin-bottom: 0;
      }

      .first {
        margin-top: 0;
      }

      .align-center {
        text-align: center;
      }

      .align-right {
        text-align: right;
      }

      .align-left {
        text-align: left;
      }

      .text-link {
        color: #0867ec !important;
        text-decoration: underline !important;
      }

      .clear {
        clear: both;
      }

      .mt0 {
        margin-top: 0;
      }

      .mb0 {
        margin-bottom: 0;
      }

      .preheader {
        color: transparent;
        display: none;
        height: 0;
        max-height: 0;
        max-width: 0;
        opacity: 0;
        overflow: hidden;
        mso-hide: all;
        visibility: hidden;
        width: 0;
      }

      .powered-by a {
        text-decoration: none;
      }

      /* -------------------------------------
	    RESPONSIVE AND MOBILE FRIENDLY STYLES
	------------------------------------- */

      @media only screen and (max-width: 640px) {
        .main p,
        .main td,
        .main span {
          font-size: 16px !important;
        }
        .wrapper {
          padding: 8px !important;
        }
        .content {
          padding: 0 !important;
        }
        .container {
          padding: 0 !important;
          padding-top: 8px !important;
          width: 100% !important;
        }
        .main {
          border-left-width: 0 !important;
          border-radius: 0 !important;
          border-right-width: 0 !important;
        }
        .btn table {
          max-width: 100% !important;
          width: 100% !important;
        }
        .btn a {
          font-size: 16px !important;
          max-width: 100% !important;
          width: 100% !important;
        }
      }
      /* -------------------------------------
	    PRESERVE THESE STYLES IN THE HEAD
	------------------------------------- */

      @media all {
        .ExternalClass {
          width: 100%;
        }
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
          line-height: 100%;
        }
        .apple-link a {
          color: inherit !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          text-decoration: none !important;
        }
        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          line-height: inherit;
        }
      }
    </style>
	  </head>
	  <body>
	    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
	      <tr>
	        <td>&nbsp;</td>
	        <td class="container">
	          <div class="content">

	            <!-- START CENTERED WHITE CONTAINER -->
	            <span class="preheader">Le DeVinci FabLab</span>
	            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="main">

	              <!-- START MAIN CONTENT AREA -->
	              <tr>
	                <td class="wrapper">
                  ${body}
	                </td>
	              </tr>

	              <!-- END MAIN CONTENT AREA -->
	              </table>

	            <!-- START FOOTER -->
	            <div class="footer">
	              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
	                <tr>
	                  <td class="content-block">
	                    <span class="apple-link">Devinci FabLab</span>
	                    <br> Ce mail est automatique merci de ne pas y répondre.
	                  </td>
	                </tr>
	              </table>
	            </div>

	            <!-- END FOOTER -->
	            
	            <!-- END CENTERED WHITE CONTAINER --></div>
	        </td>
	        <td>&nbsp;</td>
	      </tr>
	    </table>
	  </body>
	</html>`;
}

module.exports.sendMail = sendMail;
async function sendMail(userMail, subject, text) {
  const info = await transporter.sendMail({
    from: `DeVinci FabLab<${process.env.MAIL_USER}>`, // sender address
    to: userMail, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: writeEmail(`<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="padding-bottom: 10px">
    <tr>
        <td>
            <h1>Ceci est un test pour les mails</h1>
        </td>
          <td style="text-align: right;">
              <img src="${frontUrl}/logo.png" alt="Image" style="width: 100%; max-width: 200px; height: auto; margin-right: 10px; display: inline-block; vertical-align: middle;">
          </td>
      </tr>
  </table>
  ${text}`), // html body
  });

  return true;
}

module.exports.sendRegisterMail = sendRegisterMail;
async function sendRegisterMail(userMail, firstName, token) {
  const info = await transporter.sendMail({
    from: `DeVinci FabLab<${process.env.MAIL_USER}>`,
    to: userMail,
    subject: "Insciption DeVinci FabLab",
    text: `Vous vennez de créer un compte sur de site du ${frontUrl}. Pour utiliser votre compte merci de valider votre mail avec le lien ci-dessous.
      ${frontUrl}/auth/verify/${token}`,
    html: writeEmail(`<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="padding-bottom: 10px">
    <tr>
        <td>
            <h1>Bonjour ${firstName}</h1>
        </td>
          <td style="text-align: right;">
              <img src="${frontUrl}/logo.png" alt="Image" style="width: 100%; max-width: 200px; height: auto; margin-right: 10px; display: inline-block; vertical-align: middle;">
          </td>
      </tr>
  </table>

        <p>Vous vennez de créer un compte sur de site du <a href="${frontUrl}">DeVinci FabLab</a> pour utiliser votre compte merci de valider votre mail avec le bouton ci-dessous.</p>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
          <tbody>
            <tr>
              <td align="center">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tbody>
                    <tr>
                      <td> <a href="${frontUrl}/auth/verify/${token}" target="_blank">Vérifier votre email</a> </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        <p>Si vous avez des problèmes avec le lien merci de contacter directement un membre de l'association.</p>
        <p>À très vite,</p>`),
  });

  return true;
}

module.exports.sendForgetPasswordMail = sendForgetPasswordMail;
async function sendForgetPasswordMail(userMail, firstName, token) {
  const info = await transporter.sendMail({
    from: `DeVinci FabLab<${process.env.MAIL_USER}>`,
    to: userMail,
    subject: "Insciption DeVinci FabLab",
    text: `Vous vennez de faire une demande pour réinitialiser votre mot de passe pour votre compte sur de site du DeVinci FabLab. Pour réinitialiser votre mot de passe, cliquez sur le lien ci-dessous.
      ${frontUrl}/auth/password/${token}`,
    html: writeEmail(`<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="padding-bottom: 10px">
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
        <p>À très vite,</p>`),
  });

  return true;
}
