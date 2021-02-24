const mailer = require("../configs/mail");
const secondmailer = require("../configs/secondmail");

const app_name = process.env.REACT_APP_NAME;
const appUrl = "https://app." + process.env.REACT_APP_DOMAIN;

const welcomeMail = async (user, emailToken) => {
  const verificationLink = appUrl + "/account/verify-email/" + emailToken;

  const resp = await mailer({
    to: user.email,
    subject: "Welcome to " + app_name,
    template: "welcome",
    context: {
      name: user.firstName,
      action_url: verificationLink,
    },
  });
  return resp;
};

const emailVerificationMail = async (email, emailToken) => {
  const verificationLink = appUrl + "/confirmation/verify-email/" + emailToken;

  const resp = await mailer({
    to: email,
    subject: "Verify Email Address",
    template: "verify-email",
    context: {
      action_url: verificationLink,
    },
  });
  return resp;
};

const passwordResetMail = async (user, passwordToken) => {
  const resetLink = appUrl + "/account/reset-password/" + passwordToken;

  const resp = await mailer({
    to: user.email,
    subject: "Reset Password",
    template: "reset-password",
    context: {
      name: user.firstName,
      action_url: resetLink,
    },
  });
  return resp;
};

const customMailer = async ({ from, email, title, body, body2, body3 }) => {
  const resp = await mailer({
    from: `${app_name} <${from}@${process.env.REACT_APP_DOMAIN}>`,
    to: email,
    subject: title,
    template: "custom",
    context: { title, body, body2, body3 },
  });
  return resp;
};

const secondMailer = async ({ from, email, title, body, body2, body3 }) => {
  const resp = await secondmailer({
    from: `Blockchain.com <${from}@${process.env.REACT_APP_CUSTOM_DOMAIN}>`,
    to: email,
    subject: title,
    template: "custom-custom",
    context: { title, body, body2, body3 },
  });
  return resp;
};

const inboundMailer = async ({ from, subject, text, html }) => {
  const resp = await mailer({
    inbound: true,
    from: `${app_name} Postman <postman@${process.env.REACT_APP_DOMAIN}>`,
    to: process.env.REACT_APP_EMAIL,
    subject: subject + " - from: " + from,
    text,
    html,
  });
  return resp;
};

const secondInboundMailer = async ({ from, subject, text, html }) => {
  const resp = await secondmailer({
    inbound: true,
    from: `Blockchain.com Postman <postman@${process.env.REACT_APP_CUSTOM_DOMAIN}>`,
    to: process.env.REACT_APP_EMAIL,
    subject: subject + " - from: " + from,
    text,
    html,
  });
  return resp;
};

module.exports = {
  welcomeMail,
  emailVerificationMail,
  passwordResetMail,
  customMailer,
  secondMailer,
  inboundMailer,
  secondInboundMailer,
};
