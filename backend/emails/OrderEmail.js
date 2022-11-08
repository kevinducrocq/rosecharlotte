export function orderEmail(order, user) {
  return {
    subject: `Merci pour votre commande ${user.name}`, // Subject line
    html: `<div style="margin:auto;font-family: sans-serif; background-color: #fad4d4; width:100%;">

    <div style="text-align:center;padding-top: 25px; margin-bottom: 25px;"><img src="https://rosecharlotte.fr/logo-site.png"
            width="250" alt="Logo RoseCharlotte.fr">
    </div>


    <div style="margin-left:10px ;margin-right:10px;">
        <hr>
        <div style="margin-bottom: 15px; margin-top: 15px; font-size:20px;">
            <b>Récapitulatif de votre commande n° ${order._id}</b>
        </div>



            ${order.orderItems.map((item) => {
              return `
              <div style="margin-bottom:10px ;border-radius: 10px; padding:5px; max-width: 600px; background-color:#fff2f2;">
                    <div key=${
                      item._id
                    }class=" order-unit" style="overflow:hidden;margin:5px 0;">
                        <div style="max-width: 300px;float: left;margin-left: 5px; margin-right: 5px;">
                            <img src="https://rosecharlotte.fr${
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
                                    ${
                                      item.side &&
                                      `<tr>
                                          <td style="font-size:15px;">Côté : <b>${item.side}</b></td>
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
                    ${
                      order.paymentMethod === 'Cheque'
                        ? ` <tr>
                        <td style="font-size:15px;">Chèque à envoyer à : </td>
                        <td><b>Rose Charlotte et Compagnie,&nbsp;20 rue principale,&nbsp;62190,&nbsp;Ecquedecques</b>
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
        <span style='font-size:20px'>Rose charlotte et Compagnie vous remercie pour votre commande</span><br>
        <span>Nous vous informerons par mail une fois expédiée</span> <br>
        <span>A bientôt sur <a href="rosecharotte.fr">rosecharotte.fr</a></span>
    </div>

</div>`,
  };
}
