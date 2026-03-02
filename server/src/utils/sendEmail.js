const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_EMAIL || 'your_mailtrap_user',
      pass: process.env.SMTP_PASSWORD || 'your_mailtrap_password'
    }
  });

  // Define email options
  const mailOptions = {
    from: `WasteWise <${process.env.FROM_EMAIL || 'noreply@wastewise.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
