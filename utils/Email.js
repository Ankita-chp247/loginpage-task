const nodemailer = require( 'nodemailer');
const fs = require('fs');
const path = require ('path');
const Handlebars = require("handlebars")

const AvailableTemplates = { 
  REGISTERED_USER: "registration"
};

class Email {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
       port: 465,
       secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    this.body = '';
    this.subject = '';
    this.to = [];
    this.cc = '';
    this.attachments = [];
    this.webURL = process.env.SITE_URL;
  }
  /**
   * SET TEMPLATE
   */
  /**
   *
   * @method setTemplate - set template for email sending
   * @arguments  templateName name of Template
   * @arguments  replaceObject objects that replaced in template
   */

  async setTemplate(templateName, replaceObject = {}) {
    switch (templateName) {
      case AvailableTemplates.RESET_PASSWORD:
        this.subject = '';
        break;
      case AvailableTemplates.REGISTERED_USER:
        this.subject = 'Registration';
        break;
      default:
        break;
    }
    const header = fs.readFileSync(
      path.join(__dirname, '..', 'templates', 'header.hbs'),
      'utf8'
    );

    const footer = fs.readFileSync(
      path.join(__dirname, '..', 'templates', 'footer.hbs'),
      'utf8'
    );

    const content = `${header}${fs.readFileSync(
      path.join(__dirname, '..', 'templates', `${templateName}.hbs`),
      'utf8'
    )}${footer}`;

    const template = Handlebars.compile(content);
    this.body = template({
      ...replaceObject,
      webURL: this.webURL,
      adminURL: this.adminURL
    })

    return this.body;
  }

  /**
   * SET SUBJECT
   */
  /**
   * @method setSubject - set Subject for email sending
   * @arguments  subject subject of email to be send
   */
  setSubject(subject) {
    this.subject = subject;
  }

  /**
   * SET BODY
   */
  /**
   * @method setBody - set Body for email sending
   * @arguments  body body of content to send email
   * @arguments  replaceObject objects that replaced in body
   */

  setBody(body) {
    this.body = body;
  }
  /**
   * SET CC
   */
  /**
   * @method setCC - set CC for email sending
   * @arguments  CC cc of email to be send
   */

  setCC(cc) {
    this.cc = cc;
  }

  /**
   * SEND EMAIL
   */
  /**
 *
 * @method sendEmail - Method for email sending
 * @arguments  html body of email
 * @arguments  subject subject of email
 * @arguments  to email address of receiver
 * @arguments  from email address of sender
 * @arguments  cc carbon copy of mail
 * @arguments  attachments attached file with mail

*/

  async sendEmail(email) {
    if (!email) {
      throw new Error('Please provide email.'); 
    }
    const mailOption = {
    from: `"Test" <${process.env.EMAIL_USERNAME}`,
      
      to: email,
      cc: this.cc,
      subject: this.subject,
      text:"Login Successfully!",
      html: this.body,                 
      attachments: this.attachments,
    };

    return this.transporter.sendMail(mailOption);
  }
}

module.exports = {
     Email,
    AvailableTemplates 
  };




// const nodemailer = require("nodemailer");


// class Email {
//   constructor(template = "") {
//     this.subject = "";
//     this.body = "";
//     this.cc = [];
//   }
//   setSubject(subject) {
//     this.subject = subject;
//   }

//   setRawBody(body) {
//     this.body = body;
//   }

//   setBody(data) {
//     this.body = data;
//   }
//   setCC(email) {
//     this.cc = email;
//   }

//   async send(email) {
//     if (!email) {
//       throw new Error("Email not set");
//     }

//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     const info = transporter.sendMail({
//       from: `"Test" <${process.env.EMAIL_USERNAME}`,
//       to: email,
//       subject: "login successfully !",
//       text: "Login Successfully !",
//       html: this.body,
//     });
//     return info;
//   }

//   static sendEmail(data, email, cc = []) {
//     const emailClient = new Email();
//     emailClient.setBody(data);
//     emailClient.setSubject(subject);
//     emailClient.setCC(cc);
//     return emailClient.send(email);
//   }
// }
// module.exports = {
//   Email,
// }

