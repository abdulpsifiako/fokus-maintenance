const express = require('express')
const route = express.Router()
const {verifyToken, isAdmin} = require('../middlewares/verify')
const voucherController = require('../controllers/voucherController')

route.post('/create', verifyToken, isAdmin, voucherController.createVoucher)
route.post('/update', verifyToken, isAdmin, voucherController.updateVoucher)
route.post('/delete', verifyToken, isAdmin, voucherController.deleteVoucher)
route.get('/all', verifyToken, isAdmin, voucherController.getVoucher)
route.post('/cek', verifyToken, voucherController.cekVoucher)
route.get('/referal/:voucherCode', verifyToken, voucherController.getReferalCode)
route.post("/ajukan", verifyToken, voucherController.addPengajuanReferal)
route.get("/pengajuan", verifyToken, isAdmin, voucherController.getPengajuan)
route.get("/stats/:kode", verifyToken, isAdmin, voucherController.getReferralStatsByCode)
route.post("/pengajuan/:id/status", verifyToken, isAdmin, voucherController.updateStatusPengajuan)

module.exports = route