const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const client = new SESClient({});
const SENDER_EMAIL = process.env.SENDER_EMAIL || "administracion@protexwear.es";

// Base HTML template
const htmlTemplate = (title, content) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; color: #333; margin: 0; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
      .header { background-color: #111827; padding: 24px; text-align: center; }
      .header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; }
      .content { padding: 32px; line-height: 1.6; }
      .footer { background-color: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
      .btn { display: inline-block; background-color: #111827; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 16px; }
      .order-details { background-color: #f3f4f6; padding: 16px; border-radius: 6px; margin: 20px 0; border: 1px solid #e5e7eb; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>PROTEX WEAR</h1>
      </div>
      <div class="content">
        <h2 style="margin-top: 0; color: #111827;">${title}</h2>
        ${content}
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Protex Wear. Todos los derechos reservados.<br/>
        Si no has solicitado este correo, por favor ignóralo.
      </div>
    </div>
  </body>
  </html>
`;

exports.handler = async (event) => {
  console.log("Notification event received:", JSON.stringify(event));

  try {
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
        
        const total = payload.total ? \`\${payload.total}€\` : 'Ver detalles';
        
        htmlBody = htmlTemplate(
          "¡Gracias por tu pedido!",
          \`<p>Hola \${payload.name || 'Cliente'},</p>
           <p>Hemos recibido tu pedido correctamente y ya estamos preparándolo.</p>
           <div class="order-details">
             <strong>Número de pedido:</strong> #\${payload.orderId}<br/>
             <strong>Total:</strong> \${total}
           </div>
           <p>Te enviaremos otro correo en cuanto tu pedido sea enviado con la información de seguimiento.</p>
           <center><a href="https://protexwear.es/mis-pedidos" class="btn">Ver mi pedido</a></center>
           <br/>
           <p>El equipo de Protex Wear</p>\`
        );
        textBody = \`Hola \${payload.name || 'Cliente'},\n\nHemos recibido tu pedido #\${payload.orderId} correctamente.\n\nTe notificaremos cuando el pedido sea enviado.\n\nEl equipo de Protex Wear\`;
        break;

      case "AdminNewOrder":
        if (!payload.orderId) {
          throw new Error("Missing orderId in AdminNewOrder payload");
        }
        toAddresses = [SENDER_EMAIL]; // Send to admin
        subject = \`🚨 Nuevo Pedido Recibido: #\${payload.orderId}\`;
        
        const adminTotal = payload.total ? \`\${payload.total}€\` : 'N/A';
        const customerEmail = payload.email || 'N/A';
        
        htmlBody = htmlTemplate(
          "¡Nuevo Pedido!",
          \`<p>Hola Daniel,</p>
           <p>Acabas de recibir un nuevo pedido en la web.</p>
           <div class="order-details">
             <strong>Pedido:</strong> #\${payload.orderId}<br/>
             <strong>Cliente:</strong> \${customerEmail}<br/>
             <strong>Total:</strong> \${adminTotal}
           </div>
           <p>Por favor, revisa el panel de administración para ver los detalles completos y proceder a su preparación.</p>\`
        );
        textBody = \`Hola Daniel,\n\nNuevo pedido recibido: #\${payload.orderId} de \${customerEmail}.\n\nTotal: \${adminTotal}\`;
        break;

      case "OrderStatusUpdate":
        if (!payload.email || !payload.orderId || !payload.status) {
          throw new Error("Missing email, orderId or status in OrderStatusUpdate payload");
        }
        toAddresses = [payload.email];
        
        const statusMap = {
          'SHIPPED': 'Enviado',
          'DELIVERED': 'Entregado',
          'CANCELLED': 'Cancelado'
        };
        const statusEs = statusMap[payload.status] || payload.status;
        
        subject = \`Actualización de Pedido #\${payload.orderId} - \${statusEs}\`;
        htmlBody = htmlTemplate(
          "Actualización de tu pedido",
          \`<p>Hola \${payload.name || 'Cliente'},</p>
           <p>El estado de tu pedido <strong>#\${payload.orderId}</strong> ha cambiado a: <strong>\${statusEs}</strong>.</p>
           <p>Puedes acceder a tu cuenta para ver más detalles.</p>
           <center><a href="https://protexwear.es/mis-pedidos" class="btn">Ver mi pedido</a></center>
           <br/>
           <p>El equipo de Protex Wear</p>\`
        );
        textBody = \`Hola \${payload.name || 'Cliente'},\n\nEl estado de tu pedido #\${payload.orderId} ha cambiado a: \${statusEs}.\n\nEl equipo de Protex Wear\`;
        break;

      case "OrderInvoice":
        if (!payload.email || !payload.orderId) {
          throw new Error("Missing email or orderId in OrderInvoice payload");
        }
        toAddresses = [payload.email];
        subject = \`Factura de tu Pedido #\${payload.orderId}\`;
        htmlBody = htmlTemplate(
          "Factura de Pedido",
          \`<p>Hola \${payload.name || 'Cliente'},</p>
           <p>Aquí tienes la información de la factura de tu pedido <strong>#\${payload.orderId}</strong>.</p>
           <br/>
           <p>El equipo de Protex Wear</p>\`
        );
        textBody = \`Hola \${payload.name || 'Cliente'},\n\nAquí tienes la información de la factura de tu pedido #\${payload.orderId}.\n\nEl equipo de Protex Wear\`;
        break;

      default:
        console.warn(\`Unsupported notification type: \${type}\`);
        return { statusCode: 400, body: \`Unsupported notification type: \${type}\` };
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
