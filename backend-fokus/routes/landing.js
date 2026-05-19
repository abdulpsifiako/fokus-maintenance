const express = require("express");
const route = express.Router();
const landingController = require("../controllers/landingController");
const fileController = require("../controllers/fileController");
const infoController = require("../controllers/infoController");
const { verifyToken, isAdmin } = require("../middlewares/verify");
const pengalamanController = require("../controllers/pengalamanController");

route.post(
  "/term-condition",
  verifyToken,
  isAdmin,
  landingController.termCondition,
);
route.get("/get-term-condition", landingController.getTermAndCondition);
route.post("/kenali-kami", verifyToken, isAdmin, landingController.kenaliKami);
route.get("/get-kenali-kami", landingController.getKenaliKami);
route.post(
  "/kebijakan-privacy",
  verifyToken,
  isAdmin,
  landingController.privacyContent,
);
route.get("/get-kebijakan-privacy", landingController.getPrivacyContent);
route.post("/banner", verifyToken, isAdmin, landingController.addBannerImage);
route.get("/img-banner", landingController.getBannerImage);
route.post(
  "/instagram",
  verifyToken,
  isAdmin,
  landingController.addInstagramPost,
);
route.post(
  "/pengalaman",
  verifyToken,
  isAdmin,
  pengalamanController.addPengalamanPost,
);
route.get("/pengalaman", pengalamanController.getPengalamanPosts);
route.get("/info/latest", infoController.getLatestInfo);
route.post("/info/add", infoController.addInfo);
route.patch("/info/status", infoController.updateInfoStatus);
route.get("/pengalaman/all", pengalamanController.getAllPengalaman);
route.post(
  "/update/pengalaman/:id",
  verifyToken,
  isAdmin,
  pengalamanController.updatePengalaman,
);
route.post(
  "/update/pengalaman/status/:id",
  verifyToken,
  isAdmin,
  pengalamanController.updateStatus,
);
route.delete(
  "/pengalaman/:id",
  verifyToken,
  isAdmin,
  pengalamanController.deletePengalaman,
);

route.get("/instagram-post", landingController.getInstagramPosts);

route.post("/upload-file", verifyToken, isAdmin, fileController.uploadFile);
route.get("/images/:filename", fileController.getImages);
route.get("/video/:filename", fileController.getVideos);

module.exports = route;
