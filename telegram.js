// telegram.js
const fetch = require("node-fetch");
require("dotenv").config();

/**
 * Sends a contact form message to a Telegram chat using the Bot API.
 *
 * @param {Object} param0 - The contact form data.
 * @param {string} param0.name - Sender's name.
 * @param {string} param0.email - Sender's email.
 * @param {string} param0.subject - Message subject (optional).
 * @param {string} param0.message - Message content.
 */
async function sendTelegramMessage({ name, email, subject, message }) {
  // ساخت متن پیام با پشتیبانی از UTF-8
  const text = `
📩 <b>New contact form message:</b>

👤 <b>Name:</b> ${name}
📧 <b>Email:</b> ${email}
📝 <b>Subject:</b> ${subject || "No subject"}
✏️ <b>Message:</b>
${message}
  `;

  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  const result = await response.json();

  if (!result.ok) {
    throw new Error(`Telegram API error: ${result.description}`);
  }

  return result;
}

module.exports = { sendTelegramMessage };
