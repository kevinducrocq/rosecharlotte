export function orderAdminEmail(order, user) {
  return {
    subject: `Vous avez une nouvelle commande de ${user.name}`, // Subject line
    html: `<div style="margin:auto;font-family: sans-serif; background-color: #fad4d4; width:100%;">

    <div style="text-align:center;padding-top: 25px; margin-bottom: 25px;"><img src="https://rosecharlotte.fr/logo-site.png"
            width="250" alt="Logo RoseCharlotte.fr">
    </div>


    <div style="margin-left:10px ;margin-right:10px;">
        <hr>
        <div style="margin-bottom: 5px; margin-top: 15px; font-size:20px;">
            <b>Bonjour Marie ! vous avez un nouvelle commande de votre commande n° ${
              order.user.name
            }</b>
        </div>
        <div>
        <span>Commande n° ${order._id}</span><br />
        <span>Créée le ${order.createdAt.toLocaleDateString('fr')}</span>
        </div>


        <div style="display:flex; flex-direction:column;">

            ${order.orderItems.map((item) => {
              return `
                <div
                    style="margin-bottom:10px ;border-radius: 10px; padding:5px; min-width:350px;max-width: 600px; background-color:#fff2f2;">

                    <div key=${
                      item._id
                    }class=" order-unit" style="overflow:hidden;margin:5px 0;">
                        <div style="max-width: 300px;float: left;margin-left: 5px; margin-right: 5px;">
                            <img src="${
                              item.image
                            }" style="width:150px;height:150px;object-fit:cover" alt="${
                item.name
              }">
                        </div>

                        <div style="max-width: 300px;text-align: center;float: left;text-align: left;">
                            <table style="border:none;border-bottom:10px;">
                                <tbody>
                                    <tr>
                                        <td style="font-size:15px;"><b>${
                                          item.name
                                        }</b></td>
                                    </tr>
                                    ${
                                      item.variant?.name
                                        ? `<tr>
                                        <td style="font-size:15px;"><b>${item.variant.name}</b></td>
                                    </tr>`
                                        : ''
                                    }

                                    ${
                                      item.fil &&
                                      `<tr>
                                        <td style="font-size:15px;"><b>Fil ${item.fil}</b></td>
                                    </tr>`
                                    }
                                    ${
                                      item.tissu &&
                                      `<tr>
                                        <td style="font-size:15px;"><b>${item.tissu}</b></td>
                                    </tr>`
                                    }
                                    ${
                                      item.patch &&
                                      `<tr>
                                        <td style="font-size:15px;"><b>${item.patch}</b></td>
                                    </tr>`
                                    }
                                    ${
                                      item.customization &&
                                      `<tr>
                                        <td style="font-size:15px;"><b>${item.customization}</b></td>
                                    </tr>`
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div style="margin-left:5px;">
                        <span>Quantité : <b>${item.quantity}</b></span><br>
                        <span>Prix : <b>${item.price} &nbsp; €</b></span>
                    </div>

                </div>
            `;
            })}
        </div>

        <hr>

        <div style="margin-bottom:20px;">
            <table>
                <tbody>
                    <tr>
                        <td style="font-size:15px;">Produits :</td>
                        <td><b>${order.itemsPrice.toFixed(2)}&nbsp;€ </b></td>
                    </tr>
                    <tr>
                        <td style="font-size:15px;">Livraison :</td>
                        <td><b>${order.shippingPrice.toFixed(2)}&nbsp;€</b></td>
                    </tr>
                    <tr>
                        <td>Total :</td>
                        <td><b>${order.totalPrice.toFixed(2)}&nbsp;€</b></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div style="margin-bottom:20px;">
            <table>
                <tbody>
                    <tr>
                        <td style="font-size:15px;">Paiement : </td>
                        <td><b>${order.paymentMethod}</b></td>
                    </tr>
                    <tr>
                        <td style="font-size:15px;">Livraison :</td>
                        <td><b>${order.deliveryMethod}</b></td>
                    </tr>
                    ${
                      !order.paymentMethod === 'Cheque'
                        ? ` <tr>
                        <td style="font-size:15px;">Adresse :</td>
                        <td><b>${order.shippingAdress.address},&nbsp;${order.shippingAdress.zip},&nbsp;${order.shippingAdress.city},&nbsp;${order.shippingAdress.country}</b>
                        </td>
                    </tr>`
                        : ''
                    }
                </tbody>
            </table>
        </div>


        <hr>
    </div>


    <div style="text-align:center; margin-left:10px; margin-right:10px; margin-top: 15px; margin-bottom: 25px;line-height:30px;">
        <span style='font-size:20px'><a href="https://rosecharlotte.fr/order/${
          order._id
        }">Voir la commande</a></span><br>
    </div>

</div>`,
  };
}
