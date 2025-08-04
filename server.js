// server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
require("dotenv").config();

const { sendThankYouEmail } = require("./mailer");
const { sendTelegramMessage } = require("./telegram");

const app = express();

// تنظیم CORS برای درخواست‌های بین‌دامنه‌ای
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// استفاده از Helmet برای امنیت هدرها
app.use(helmet());

// محدودیت درخواست‌ها برای جلوگیری از حملات Brute-Force
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 دقیقه
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100, // حداکثر 100 درخواست در هر IP
  standardHeaders: true, // ارسال اطلاعات rate-limit در هدرها
  legacyHeaders: false,
});
app.use(limiter);

// جلوگیری از NoSQL Injection

// جلوگیری از حملات XSS
app.use(xssClean());

// جلوگیری از HTTP Parameter Pollution
app.use(hpp());

// پردازش کوکی‌ها برای CSRF

// CSRF Protection

// میدل‌ویر رفع مشکل UTF-8
app.use((req, res, next) => {
  if (
    req.headers["content-type"] &&
    req.headers["content-type"].includes("application/json") &&
    !req.headers["content-type"].includes("charset")
  ) {
    req.headers["content-type"] = "application/json; charset=utf-8";
  }
  next();
});

// پارس JSON با محدودیت اندازه
app.use(express.json({ limit: "10kb" }));

// middleware for CSRF token in responses

// اندپوینت تماس
app.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // اعتبارسنجی فیلدهای ضروری
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and message are required.",
      });
    }

    console.log("📩 Received Data:", JSON.stringify(req.body));

    // ارسال ایمیل تشکر
    sendThankYouEmail(email, name)
      .then(() => console.log("📧 Thank-you email sent successfully"))
      .catch((err) => console.error("❌ Failed to send thank-you email:", err));

    // ارسال نوتیفیکیشن به تلگرام
    await sendTelegramMessage({ name, email, subject, message });

    res.json({
      success: true,
      message: "Your message has been successfully received.",
    });
  } catch (err) {
    console.error("🔥 Server error:", err);
    res.status(500).json({
      success: false,
      error: "Server error while processing your request.",
    });
  }
});

// راه‌اندازی سرور
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at: http://localhost:${PORT}`);
});
