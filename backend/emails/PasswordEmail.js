export function passwordEmail(sender, userEmail, link) {
  return {
    subject: `Réinitialisation de votre mot de passe`, // Subject line
    html: `
    <div style="margin:auto;font-family: sans-serif; background-color: #fad4d4; width:100%;">

    <div style="text-align:center;padding-top: 25px; margin-bottom: 25px;"><img src="https://rosecharlotte.fr/logo-site.png"
            width="250" alt="Logo RoseCharlotte.fr">
    </div>

    <div style="margin-left:10px ;margin-right:10px;">
        <hr>
        <div style="margin-bottom: 15px; margin-top: 15px; font-size:20px;">
            <b> Bonjour, vous avez demandé la réinitialisation de votre mot de passe</b><br /><br /> 
            <hr />
            </p> Cliquez sur le lien suivant pour continuer la procédure de réinitialisation :<br /><br /><a href="${link}">${link}</a> <br /><br /> Attention, ce lien est valide pendant 5 minutes, passé ce délai, merci de réitérer votre demande de mot de passe</p>
        </div>

        <div style="text-align:center; margin-left:10px; margin-right:10px; margin-top: 15px; margin-bottom: 25px;line-height:30px;">
        <span style='font-size:20px'>Rose charlotte et Compagnie vous remercie pour votre confiance</span><br>
        <span>A bientôt sur <a href="rosecharotte.fr">rosecharotte.fr</a></span>
    </div>

    </div>

  </div>`,
  };
}
