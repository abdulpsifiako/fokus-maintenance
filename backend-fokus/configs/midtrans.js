const midtransClient = require("midtrans-client");
// Create Core API instance
let snap = new midtransClient.Snap({
  isProduction: true,
  serverKey: process.env.MIDTRANS_S_KEY,
  clientKey: process.env.MIDTRANS_C_KEY,
});

module.exports = snap;
