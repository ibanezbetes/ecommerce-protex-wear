const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const sesClient = new SESClient({});
const SENDER_EMAIL = process.env.SENDER_EMAIL || "Daniel.guillen@protexwear.es";

exports.handler = async (event) => {
  console.log("Cognito Event received:", JSON.stringify(event));

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
        .code-box { background-color: #f3f4f6; border: 1px solid #e5e7eb; padding: 12px 24px; font-size: 24px; font-weight: bold; letter-spacing: 4px; text-align: center; margin: 24px 0; border-radius: 6px; color: #111827; }
        .btn { display: inline-block; background-color: #111827; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://protexwear.es/logo.png" alt="Protex Wear" style="height:40px; width:auto; display:inline-block;" />
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

  // 1. Manejo de CustomMessage (Registros y Contraseñas)
  // Cognito espera que devolvamos el evento modificado.
  if (event.triggerSource === "CustomMessage_SignUp") {
    const code = event.request.codeParameter;
    const name = event.request.userAttributes.name || "Usuario";
    
    event.response.emailSubject = "Verifica tu cuenta en Protex Wear";
    event.response.emailMessage = htmlTemplate(
      "Verificación de cuenta",
      `<p>Hola ${name},</p>
       <p>¡Gracias por registrarte en Protex Wear! Para completar tu registro y activar tu cuenta, por favor introduce el siguiente código de verificación en la aplicación:</p>
       <div class="code-box">${code}</div>
       <p>Si no te has registrado en Protex Wear, puedes ignorar este correo de forma segura.</p>`
    );
    return event;
  }

  if (event.triggerSource === "CustomMessage_ForgotPassword") {
    const code = event.request.codeParameter;
    const name = event.request.userAttributes.name || "Usuario";
    
    event.response.emailSubject = "Recuperación de contraseña - Protex Wear";
    event.response.emailMessage = htmlTemplate(
      "Restablecer contraseña",
      `<p>Hola ${name},</p>
       <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Utiliza este código de verificación para elegir una nueva contraseña:</p>
       <div class="code-box">${code}</div>
       <p>Si no has solicitado restablecer tu contraseña, ignora este correo y tu contraseña actual seguirá siendo válida.</p>`
    );
    return event;
  }

  // 2. Manejo de PostConfirmation (Correo de Bienvenida)
  // Tras verificar la cuenta, enviamos un email por SES de bienvenida.
  if (event.triggerSource === "PostConfirmation_ConfirmSignUp") {
    const email = event.request.userAttributes.email;
    const name = event.request.userAttributes.name || "Usuario";

    const subject = "¡Bienvenido a Protex Wear!";
    const htmlBody = htmlTemplate(
      "¡Bienvenido a la familia!",
      `<p>Hola ${name},</p>
       <p>Tu cuenta ha sido verificada correctamente. ¡Bienvenido a Protex Wear!</p>
       <p>Ya puedes acceder a nuestra tienda y descubrir nuestra colección de ropa protectora diseñada para tu comodidad y seguridad.</p>
       <center><a href="https://protexwear.es" class="btn">Visitar Tienda</a></center>
       <br/>
       <p>Si tienes alguna duda, no dudes en responder a este correo.</p>`
    );

    const command = new SendEmailCommand({
      Source: SENDER_EMAIL,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: subject, Charset: "UTF-8" },
        Body: { Html: { Data: htmlBody, Charset: "UTF-8" } },
      },
    });

    try {
      await sesClient.send(command);
      console.log("Welcome email sent successfully to", email);
    } catch (error) {
      console.error("Error sending welcome email:", error);
      // No lanzamos error para no bloquear el flujo de confirmación de Cognito
    }
    
    return event;
  }

  // Devolver el evento sin modificar para otros triggers
  return event;
};
