const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');
const { verifyToken, isAdmin } = require('../middlewares/verify');


router.post('/', verifyToken, isAdmin, programController.createProgram);
router.post('/:id',  verifyToken, isAdmin,  programController.updateProgram);
router.get('/get', programController.getProgram)
router.get('/landing', programController.getProgramLanding)
router.get('/paket', programController.getPaketProgram)
router.post('/delete/:id', verifyToken, isAdmin, programController.deleteProgram);

module.exports = router;