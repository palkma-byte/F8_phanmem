const {MAIL_HOST,MAIL_PORT,MAIL_SECURE,MAIL_USERNAME,MAIL_PASSWORD} = process.env
const nodemailer = require("nodemailer");
class SendMail {
  constructor(job) {
    this.job = job;
  }

  handle = async () => {
    //Logic gửi email
    const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT,
      secure: MAIL_SECURE,
      auth: {
        user: MAIL_USERNAME,
        pass: MAIL_PASSWORD,
      },
    });
    const info = await transporter.sendMail({
      from: `Pham Hoang <phamhoangbhaz@gmail.com>`, // sender address
      to: this.job.email, // list of receivers
      subject: this.job.subject, // Subject line
      html:this.job.content,
    });
  };
}

module.exports = SendMail;