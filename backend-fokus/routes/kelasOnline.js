const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/verify");
const kelasOnlineController = require("../controllers/kelasOnlineController");

router.post(
  "/create",
  verifyToken,
  isAdmin,
  kelasOnlineController.createKelasOnline
);
router.get("/get", kelasOnlineController.getkelasOnline);
router.get(
  "/admin-get",
  verifyToken,
  isAdmin,
  kelasOnlineController.adminkelasOnline
);
router.post(
  "/update/:id",
  verifyToken,
  isAdmin,
  kelasOnlineController.updateKelasOnline
);
router.post(
  "/delete/:id",
  verifyToken,
  isAdmin,
  kelasOnlineController.deleteKelasOnline
);

module.exports = router;
