const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const client = new SESClient({});
const SENDER_EMAIL = process.env.SENDER_EMAIL;

exports.handler = async (event) => {
  console.log("Notification event received:", JSON.stringify(event));

  try {
    // We expect the event to have type (e.g., 'OrderConfirmation', 'UserWelcome') and payload
    const { type, payload } = event;

    if (!type || !payload) {
      throw new Error("Missing type or payload in event");
    }

    let toAddresses = [];
    let subject = "";
    let htmlBody = "";
    let textBody = "";

    switch (type) {
      case "OrderConfirmation":
        if (!payload.email || !payload.orderId) {
          throw new Error("Missing email or orderId in OrderConfirmation payload");
        }
        toAddresses = [payload.email];
        subject = `Confirmación de Pedido #${payload.orderId}`;
        htmlBody = `
          <h1>¡Gracias por tu pedido!</h1>
          <p>Hola ${payload.name || 'Cliente'},</p>
          <p>Hemos recibido tu pedido <strong>#${payload.orderId}</strong> correctamente.</p>
          <p>Te notificaremos cuando el pedido sea enviado.</p>
          <br/>
          <p>El equipo de Protex Wear</p>
        `;
        textBody = `Hola ${payload.name || 'Cliente'},\n\nHemos recibido tu pedido #${payload.orderId} correctamente.\n\nTe notificaremos cuando el pedido sea enviado.\n\nEl equipo de Protex Wear`;
        break;

      case "OrderInvoice":
        if (!payload.email || !payload.orderId) {
          throw new Error("Missing email or orderId in OrderInvoice payload");
        }
        toAddresses = [payload.email];
        subject = `Factura de tu Pedido #${payload.orderId}`;
        htmlBody = `
          <h1>Factura de Pedido</h1>
          <p>Hola ${payload.name || 'Cliente'},</p>
          <p>Aquí tienes la información de la factura de tu pedido <strong>#${payload.orderId}</strong>.</p>
          <br/>
          <p>El equipo de Protex Wear</p>
        `;
        textBody = `Hola ${payload.name || 'Cliente'},\n\nAquí tienes la información de la factura de tu pedido #${payload.orderId}.\n\nEl equipo de Protex Wear`;
        break;

      default:
        console.warn(`Unsupported notification type: ${type}`);
        return { statusCode: 400, body: `Unsupported notification type: ${type}` };
    }

    const command = new SendEmailCommand({
      Source: SENDER_EMAIL,
      Destination: {
        ToAddresses: toAddresses,
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: "UTF-8",
          },
          Text: {
            Data: textBody,
            Charset: "UTF-8",
          },
        },
      },
    });

    const response = await client.send(command);
    console.log("Email sent successfully:", response.MessageId);
    return { statusCode: 200, body: JSON.stringify({ messageId: response.MessageId }) };

  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
