const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'email-smtp.eu-west-1.amazonaws.com',
  port: 465,
  secure: true,
  auth: {
    user: 'AKIAZYGLSSSDVFVOABOH',
    pass: 'BOFeBse2osrk0e7LD9PsqVPid6Eim2Ap0mMr8xH7HYQp',
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function main() {
  try {
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: '"Protex Wear Test" <Daniel.guillen@protexwear.es>',
      to: 'Daniel.guillen@protexwear.es',
      subject: 'Test SES Email',
      text: 'This is a test email from NodeMailer.',
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

main();
