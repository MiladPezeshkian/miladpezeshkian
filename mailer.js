// mailer.js
const nodemailer = require("nodemailer");
require("dotenv").config();

// ساخت ترنسپورت با تنظیمات ایمیل
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: +process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ارسال ایمیل تشکر با پشتیبانی از فارسی
async function sendThankYouEmail(to, name) {
  // لاگ کردن داده‌های واقعی که برای ارسال ایمیل استفاده می‌شود
  console.log(`ارسال ایمیل به: { to: '${to}', name: '${name}' }`);

  const mailOptions = {
    from: `"${process.env.EMAIL_SENDER_NAME}" <${process.env.EMAIL_USER}>`,
    to,
    subject: "متشکریم از تماس شما!",
    encoding: "UTF-8",
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      </head>
      <body>
        <p>سلام ${name} عزیز،</p>
        <p>پیام شما با موفقیت دریافت شد و به زودی پاسخ خواهیم داد.</p>
        <p>با احترام،<br>${process.env.EMAIL_SENDER_NAME}</p>
      </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendThankYouEmail };
