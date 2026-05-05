const express = require("express");
const transaksiController = require("../controllers/transaksiController");

const { verifyToken, isAdmin } = require("../middlewares/verify");
const route = express.Router();

route.post("/create", verifyToken, transaksiController.createTransaksi);
route.post(
  "/create-snap",
  verifyToken,
  transaksiController.createSnapTransaksi
);
route.post(
  "/create-snap-pembelian",
  verifyToken,
  transaksiController.createSnapTransaksiPembelian
);
route.post(
  "/create-free-program",
  verifyToken,
  transaksiController.createTransaksiFreeProgram
);
route.post(
  "/create-free-to",
  verifyToken,
  transaksiController.createTransaksiTO
);
route.post(
  "/create-to-rp-nol",
  verifyToken,
  transaksiController.createTransaksiTONolPremium
);
route.post(
  "/create-free-kelas",
  verifyToken,
  transaksiController.createTransaksiKelas
);
route.post("/create-to", verifyToken, transaksiController.createPembelianTO);
route.post("/update", transaksiController.updateTransaksi);
route.post("/update-not", transaksiController.handleMidtransNotification);
route.get("/get-user", verifyToken, transaksiController.getTransaksiUser);
route.get(
  "/puscashed/:program_id",
  verifyToken,
  transaksiController.getTransaksiProgram
);
route.get(
  "/puscashed/to/:program_id",
  verifyToken,
  transaksiController.getTransaksiTO
);
route.get(
  "/semua",
  verifyToken,
  isAdmin,
  transaksiController.getAllTransaksiUser
);
route.post("/pengajuan", verifyToken, transaksiController.addPengajuanKode);

module.exports = route;
