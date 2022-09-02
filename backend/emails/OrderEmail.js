export function orderEmail(order, user) {
  return {
    subject: `Merci pour votre commande ${user.name}`, // Subject line
    text: 'Hello world?', // plain text body
    html: '<h1>', // html body
  };
}
