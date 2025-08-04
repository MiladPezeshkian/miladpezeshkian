// testContact.js

fetch("http://localhost:4000/contact", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  body: JSON.stringify({
    name: "میلاد",
    email: "milad@example.com",
    subject: "درخواست همکاری",
    message: "سلام، لطفاً با من تماس بگیرید",
  }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log("✅ پاسخ سرور:", data);
  })
  .catch((err) => {
    console.error("❌ خطا:", err);
  });
