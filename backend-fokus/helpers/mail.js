const transporter = require("../configs/transport");
const { default: hbs } = require("nodemailer-express-handlebars");
const path = require("path");

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".handlebars",
      partialsDir: path.resolve("./templates"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./templates"),
    extName: ".handlebars",
  }),
);

const sendEmail = async ({ to, subject, template, context }) => {
  await transporter.sendMail({
    from: '"Fokus Edu" <admin@fokusedu.id>',
    to,
    subject,
    template,
    context,
  });
};

module.exports = sendEmail;
