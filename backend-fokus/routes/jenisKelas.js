const express = require('express');
const router = express.Router();
const jenisProgramController = require('../controllers/jenisProgramController');
const { verifyToken, isAdmin } = require('../middlewares/verify');
const jenisKelasController = require('../controllers/jenisKelasController');

router.post('/create', verifyToken, isAdmin, jenisKelasController.createJenisProgram);
router.post('/update/:id', verifyToken, isAdmin, jenisKelasController.updateJenisProgram);
router.get('/list', jenisKelasController.getJenisProgram);
router.post('/delete/:id', verifyToken, isAdmin, jenisKelasController.deleteJenisProgram);

module.exports = router;