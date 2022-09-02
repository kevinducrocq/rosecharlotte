export function contactEmail(senderName, senderEmail, message) {
  return {
    subject: `Nouveau message de ${senderName}`, // Subject line
    html: `<div style="margin:auto;font-family: sans-serif">
    <div style="margin-bottom: 10px;"><b>Nouveau message de ${senderName}</b></div>
    <div style="margin:auto;">
      <div style="border: 1px solid;padding: 5px;">
    ${message}
      </div>,
      </div>`,
  };
}
