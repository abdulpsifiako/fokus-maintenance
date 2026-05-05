const express = require("express");
const { verifyToken, isAdmin } = require("../middlewares/verify");
const videoController = require("../controllers/videoController");
const route = express.Router();

route.post("/create", verifyToken, isAdmin, videoController.createVideo);
route.post(
  "/v-delete/:id",
  verifyToken,
  isAdmin,
  videoController.deleteVideoProgramUtama
);
route.get(
  "/list",
  verifyToken,
  isAdmin,
  videoController.getListVideoProgramUtama
);
route.get(
  "/list-latihan",
  verifyToken,
  isAdmin,
  videoController.getInfoProgramFiturLatihan
);
route.post(
  "/update/:id",
  verifyToken,
  isAdmin,
  videoController.updateVideoProgram
);
route.get("/v-id/:program_id", videoController.getVideobyId);
route.get("/l-id/:program_id", videoController.getLatihanById);

module.exports = route;
