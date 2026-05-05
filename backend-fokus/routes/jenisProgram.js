const express = require('express');
const router = express.Router();
const jenisProgramController = require('../controllers/jenisProgramController');
const { verifyToken, isAdmin } = require('../middlewares/verify');

router.post('/create', verifyToken, isAdmin, jenisProgramController.createJenisProgram);
router.post('/update/:id', verifyToken, isAdmin, jenisProgramController.updateJenisProgram);
router.get('/list', jenisProgramController.getJenisProgram);
router.post('/delete/:id', verifyToken, isAdmin, jenisProgramController.deleteJenisProgram);

module.exports = router;