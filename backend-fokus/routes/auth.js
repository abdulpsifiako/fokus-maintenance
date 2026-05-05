const express = require ('express')
const authController = require('../controllers/authController')
const validation = require('../middlewares/validation')
const { verifyToken, isAdmin } = require('../middlewares/verify')
const route = express.Router()

route.post('/daftar', validation.formSignup, authController.daftar)
route.post('/login', authController.login)
route.post('/konfirmasi-email', authController.konfirmasiEmail)
route.get('/session', verifyToken, authController.cekSession)
route.get('/keluar', verifyToken, authController.logoutApp)
route.post('/tambah-user', verifyToken, isAdmin, authController.addUserAndProgram)

module.exports= route