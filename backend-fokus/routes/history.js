const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/verify");
const historyConroller = require("../controllers/historyConroller");

router.post('/create', verifyToken, historyConroller.createHistory)
router.post('/get', verifyToken, historyConroller.getHistory)

module.exports = router;