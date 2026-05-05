const express = require('express')
const { verifyToken, isAdmin } = require('../middlewares/verify')
const dashboard = require('../controllers/dashboard')
const fileController = require('../controllers/fileController')
const route = express.Router()

route.get("/count", verifyToken, isAdmin,dashboard.getJumlahUser)
route.get("/count-transaksi", verifyToken, isAdmin,dashboard.getCountTransaksi)
route.get("/count-pengunjung", verifyToken, isAdmin,dashboard.getJumlahPengunjung)
route.get("/user-and-count", verifyToken, isAdmin,dashboard.getAllUser)
route.get("/setting", verifyToken, isAdmin,dashboard.getSetting)
route.post("/update/setting", verifyToken, isAdmin,dashboard.updateSetting)

route.get('/videos/:filename', fileController.getVideos);

module.exports=route