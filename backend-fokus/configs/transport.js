const nodemailer = require("nodemailer");

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  pool: true, // Mengaktifkan pooling koneksi
  maxConnections: 1, // Hanya membuka 1 koneksi ke server dalam satu waktu
  maxMessages: 5, // Membatasi pengiriman pesan per koneksi sebelum dibuat ulang
  rateLimit: 1, // Mengirim maksimal 1 email setiap...
  rateDelta: 5000, // ...5000 milidetik (5 detik)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

module.exports = transporter;
