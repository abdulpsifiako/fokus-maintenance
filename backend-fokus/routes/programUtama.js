const express = require("express");
const route = express.Router();

const { verifyToken, isAdmin } = require("../middlewares/verify");
const programUtamaController = require("../controllers/programUtamaController");
const videoController = require("../controllers/videoController");
const answerUserController = require("../controllers/answerUserController");
const programController = require("../controllers/programController");
const laporSoalController = require("../controllers/laporSoalController");

route.post(
  "/create",
  verifyToken,
  isAdmin,
  programUtamaController.createProgramUtama,
);
route.get("/get", programUtamaController.getProgramUtama);
route.get(
  "/admin-get",
  verifyToken,
  isAdmin,
  programUtamaController.getProgramUtamaAdmin,
);
route.post(
  "/update/:id",
  verifyToken,
  isAdmin,
  programUtamaController.updateProgramUtama,
);
route.get("/get-one/:id", programUtamaController.getProgramUtamaById);
route.get("/programku", verifyToken, programUtamaController.getProgramKu);
route.post(
  "/delete/:id",
  verifyToken,
  isAdmin,
  programUtamaController.deleteProgramUtama,
);
route.post(
  "/status-lapor/:id",
  verifyToken,
  isAdmin,
  laporSoalController.updateStatusLaporan,
);
route.get(
  "/list-video",
  verifyToken,
  isAdmin,
  programUtamaController.getListProgramUtamaVideo,
);
route.get(
  "/list-materi-latihan/:program_id",
  verifyToken,
  isAdmin,
  videoController.getListMateri,
);
route.get(
  "/list-submateri-latihan/:program_id",
  verifyToken,
  isAdmin,
  videoController.getListSubMateri,
);
route.post(
  "/create-latihan",
  verifyToken,
  isAdmin,
  videoController.createLatihan,
);
route.post(
  "/update-latihan/:id",
  verifyToken,
  isAdmin,
  videoController.updateLatihan,
);
route.get(
  "/list-latihan",
  verifyToken,
  isAdmin,
  videoController.getLatihanProgramUtama,
);
route.post(
  "/delete-latihan/:id",
  verifyToken,
  isAdmin,
  videoController.deleteLatihanProgramUtama,
);
route.post("/save-answer", verifyToken, answerUserController.createAnswerUser);
route.post(
  "/get-pembahasan",
  verifyToken,
  answerUserController.getAllAnswerByUser,
);
route.post(
  "/get-pembahasan-by-id",
  verifyToken,
  answerUserController.getAnswerById,
);
route.post("/get-rapor", verifyToken, answerUserController.getAllRaporByUser);
route.post("/get-ranking", verifyToken, answerUserController.getRangkingTO);
route.post("/count", verifyToken, programController.getCountLatihanSoal);
route.get(
  "/latihan-mycount",
  verifyToken,
  answerUserController.getCountLAtihanDikerjakan,
);
route.post(
  "/laporkan-soal",
  verifyToken,
  laporSoalController.createLaporanSoal,
);
route.get("/laporan", verifyToken, laporSoalController.getLaporanAll);

module.exports = route;
