const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: "faliana23@gmail.com",
  from: {
    name: "Beautify",
    email: process.env.FROM_EMAIL,
  }, // Use the email address or domain you verified above
  subject: "Sending with Twilio SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};

const sendMail = async ({
  to = "faliana23@gmail.com",
  from = {
    name: "Beautify",
    email: process.env.FROM_EMAIL,
  }, // Use the email address or domain you verified above
  subject = "Sending with Twilio SendGrid is Fun",
  text = "and easy to do anywhere, even with Node.js",
  html = "<strong>and easy to do anywhere, even with Node.js</strong>",
}) => {
  try {
    // await sgMail.send(msg);

    const message = {
      to: to,
      from: from,
      subject: subject,
      text: text,
      html: html,
    };
    await sgMail.send(message);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};

module.exports = sendMail;
