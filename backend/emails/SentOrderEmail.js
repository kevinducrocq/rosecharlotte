export function sentOrderEmail(order, user) {
  return {
    subject: `${user.name}, votre commande a été envoyée`, // Subject line
    html: `<div style="margin:auto;font-family: sans-serif">
      <div style="margin-bottom: 10px;"><b>Bonjour ${
        user.name
      }, Votre commande :${order._id} a été envoyée</b></div>
      <div style="margin:auto;">
        <div style="border: 1px solid;padding: 5px;">
    Récapitulatif de votre commande :
          ${order.orderItems.map((item) => {
            return `<div key=${
              item._id
            }class="order-unit" style="overflow:hidden;margin:5px 0;">
    
            <div style="max-width: 300px;float: left;margin-left: 5px; object-fit:cover">
              <img src="${item.image}" style="width:100px;height:100px;" alt="${
              item.name
            }">
            </div>
    
            <div style="max-width: 300px;float: left;text-align: left;margin-right: 5px;">
              <span>
                ${item.name} <br />
                ${item.variant?.name ?? ''} <br>
                <strong>Fil : </strong> ${item.fil ? item.fil : ''} <br>
                <strong>Tissu : </strong> ${item.tissu ? item.tissu : ''} <br>
                <strong>Patch : </strong>${item.patch ? item.patch : ''} <br>
                <strong>Texte : </strong>${item.customization ? item.customization : ''} <br>
              </span>
              <span>Quantité: ${item.quantity}</span>
              <br>
              <br>
              <div style="max-width: 300px;float: right;text-align: right;margin-right: 5px;">
                <div style="font-size: 12px"><b>${item.price}&nbsp;€</b></div>
              </div>
            </div>
    
          </div>`;
          })}
    
          <hr>
    
          <div>
    
            <div>
              <strong>Total produits : </strong>${order.itemsPrice.toFixed(
                2
              )}&nbsp;€ <br />
              <strong>Frais de livraison :</strong> ${order.shippingPrice.toFixed(
                2
              )}&nbsp;€
            </div>
    
            <div>
              <strong>Total
                :</strong> ${order.totalPrice.toFixed(2)}&nbsp;€
            </div>
          </div>
        </div>
      </div>
    </div>
    `,
  };
}
