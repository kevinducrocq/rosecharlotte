export function reviewEmail(review, product) {
  return {
    subject: `Nouveau commentaire de ${review.name}`,
    html: `
    <div style="margin:auto;font-family: sans-serif; background-color: #fad4d4; width:100%;">

    <div style="text-align:center;padding-top: 25px; margin-bottom: 25px;"><img src="https://rosecharlotte.fr/logo-site.png"
            width="250" alt="Logo RoseCharlotte.fr">
    </div>


    <div style="margin-left:10px ;margin-right:10px;">
        <hr>
        <div style="margin-bottom: 15px; margin-top: 15px; font-size:20px;">
            <b>        Bonjour Marie, vous avez un nouveau commentaire de <strong>${review.name} à valider</b><br /><br />
            <strong>Produit concerné : </strong> ${product.name} <br />
            <strong>Note :</strong> ${review.rating} / 5 <br />
            <strong>Commentaire : </strong> ${review.comment} <br /> <br />
      
        </div>

        <hr>
    </div>


    <div style="text-align:center; margin-left:10px; margin-right:10px; margin-top: 15px; margin-bottom: 25px;line-height:30px;">
        <span style='font-size:20px'><a href="https://rosecharlote.fr/admin/product/${product._id}/review/${review._id}">Valider le commentaire</a></span><br>
    </div>

</div>
       
  </div>`
  };
}
