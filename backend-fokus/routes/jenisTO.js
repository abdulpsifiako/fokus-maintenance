const express = require('express');
const router = express.Router();
const jenisProgramController = require('../controllers/jenisProgramController');
const { verifyToken, isAdmin } = require('../middlewares/verify');
const jenisTOController = require('../controllers/jenisTOController');

router.post('/create', verifyToken, isAdmin, jenisTOController.createJenisProgram);
router.post('/update/:id', verifyToken, isAdmin, jenisTOController.updateJenisProgram);
router.get('/list', jenisTOController.getJenisProgram);
router.post('/delete/:id', verifyToken, isAdmin, jenisTOController.deleteJenisProgram);

module.exports = router;