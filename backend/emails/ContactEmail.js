export function contactEmail(senderName, senderEmail, message) {
  return {
    subject: `Nouveau message de ${senderName}`, // Subject line
    html: `
    <div style="margin:auto;font-family: sans-serif; background-color: #fad4d4; width:100%;">

    <div style="text-align:center;padding-top: 25px; margin-bottom: 25px;"><img src="https://rosecharlotte.fr/logo-site.png"
            width="250" alt="Logo RoseCharlotte.fr">
    </div>

    <div style="margin-left:10px ;margin-right:10px;">
        <hr>
        <div style="margin-bottom: 15px; margin-top: 15px; font-size:20px;">
            <b> Bonjour Marie, vous avez un nouveau message de <strong>${senderName}</b><br /><br /> 
            <hr />
            </p> ${message} <br /></p>
        </div>
    </div>

  </div>`,
  };
}
