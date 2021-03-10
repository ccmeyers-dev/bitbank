const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const options = {
  auth: {
    api_key: process.env.MAILGUN_CUSTOM_API_KEY,
    domain: `mg.${process.env.REACT_APP_CUSTOM_DOMAIN}`,
  },
};

const transporter = nodemailer.createTransport(mg(options));

const template = (file, context) => {
  const source = fs.readFileSync(
    path.join(__dirname, `../templates/${file}.hbs`),
    "utf8"
  );
  const hbsTemplate = handlebars.compile(source);

  return hbsTemplate(context);
};

const mailer = async (options) => {
  if (options.inbound) {
    const { inbound, ...inboundOptions } = options;
    return transporter.sendMail(inboundOptions);
  }
  const { template: file, context, ...restOptions } = options;

  const mailOptions = { ...restOptions, html: template(file, context) };

  return transporter.sendMail(mailOptions);
};

module.exports = mailer;
