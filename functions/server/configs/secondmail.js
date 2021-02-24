const nodemailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const transporter = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.SENDGRID_CUSTOM_API_KEY,
  })
);

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
