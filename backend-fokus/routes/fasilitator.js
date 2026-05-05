const express = require("express");
const router = express.Router();
const fasilitatorController = require("../controllers/fasilitatorController");
const { verifyToken, isAdmin } = require("../middlewares/verify");

router.post("/create", verifyToken, isAdmin, fasilitatorController.createFasilitator);
router.get("/get", fasilitatorController.getAllFasilitator);
router.post("/update/:id", verifyToken, isAdmin, fasilitatorController.updateFasilitator);
router.post("/update-status/:id", verifyToken, isAdmin, fasilitatorController.updateStatusFasilitator);
router.post("/delete/:id", verifyToken, isAdmin, fasilitatorController.deleteFasilitator);

module.exports = router;