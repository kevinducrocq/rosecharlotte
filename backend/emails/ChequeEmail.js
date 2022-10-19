export function chequeEmail(order, user) {
  return {
    subject: `Nous avons reçu votre chèque !`,
    html: `
    <div style="margin:auto;font-family: sans-serif; background-color: #fad4d4; width:100%;">

    <div style="text-align:center;padding-top: 25px; margin-bottom: 25px;"><img src="https://rosecharlotte.fr/logo-site.png"
            width="250" alt="Logo RoseCharlotte.fr">
    </div>


    <div style="margin-left:10px ;margin-right:10px;">
        <hr>

        <div style="margin-bottom: 15px; margin-top: 15px; font-size:20px;">
            <b>Bonjour ${user.name}, Nous avons bien reçu votre chèque pour votre commande ${order._id}</b><br /><br />
            <a href="https://rosecharlotte.fr/order/${order._id}">Voir votre commande</a>
        </div>

        <div style="text-align:center; margin-left:10px; margin-right:10px; margin-top: 15px; margin-bottom: 25px;line-height:30px;">
            <span>Nous vous informerons par mail une fois expédiée</span> <br>
            <span style='font-size:20px'>Rose charlotte et Compagnie vous remercie pour votre commande</span><br>
            <span>A bientôt sur <a href="rosecharotte.fr">rosecharotte.fr</a></span>
        </div>

        <hr>
    </div>

</div>
       
  </div>`,
  };
}
