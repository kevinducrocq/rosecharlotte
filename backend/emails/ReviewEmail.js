export function reviewEmail(review, product) {
  return {
    subject: `Nouveau commentaire de ${review.name}`,
    html: `<div style="margin:auto;font-family: sans-serif" ; padding:15px;>
    <div style="margin:auto;">
      <div style="border: 1px solid;padding: 5px;">
        Bonjour, vous avez un nouveau commentaire de <strong>${review.name}</strong> à valider. <br /><br />
        <strong>Produit concerné : </strong> ${product.name} <br />
        <strong>Note :</strong> ${review.rating} / 5 <br />
        <strong>Commentaire : </strong> ${review.comment} <br /> <br />
  
        <a href="/">Voir et valider le commentaire</a>
  
      </div>
    </div>
  </div>`
  };
}
