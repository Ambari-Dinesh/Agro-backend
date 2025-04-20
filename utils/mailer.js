const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER, // your email
    pass: process.env.MAIL_PASS, // app password
  },
});

const sendMail = async (to, subject,htmlContent ) => {
   
  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject,
    html:htmlContent,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendMail;
