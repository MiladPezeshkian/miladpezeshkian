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
  const text = `
📩 <b>New contact form message:</b>

👤 <b>Name:</b> ${name}
📧 <b>Email:</b> ${email}
📝 <b>Subject:</b> ${subject || "No subject"}
✏️ <b>Message:</b>
${message}
  `.trim();

  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  try {
    console.log("▶️ [Telegram] Preparing to send message");
    console.log("▶️ [Telegram] URL:", url);
    console.log("▶️ [Telegram] Chat ID:", chatId);
    console.log("▶️ [Telegram] Payload text:", text);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    console.log("◀️ [Telegram] HTTP status:", response.status);
    const result = await response.json();
    console.log("◀️ [Telegram] Response JSON:", result);

    if (!result.ok) {
      throw new Error(`Telegram API error: ${result.description}`);
    }

    console.log(
      "✅ [Telegram] Message sent successfully, message_id:",
      result.result.message_id
    );
    return result;
  } catch (err) {
    console.error("🔥 [Telegram] Fetch failed:", err);
    if (err.cause) console.error("🔥 [Telegram] Cause:", err.cause);
    throw err;
  }
}

module.exports = { sendTelegramMessage };
