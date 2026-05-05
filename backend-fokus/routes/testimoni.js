const express = require('express');
const route = express.Router();
const testimoniController = require('../controllers/testimoniController');
const { verifyToken, isAdmin } = require('../middlewares/verify');
const profileController = require('../controllers/profileController');

route.post('/create', verifyToken, testimoniController.addTestimoniUser);
route.get('/user', verifyToken, isAdmin, testimoniController.getTestimony)
route.post('/update-status/:id', verifyToken, isAdmin, testimoniController.updateStatusTestimoni)
route.post('/delete-testimoni/:id', verifyToken, isAdmin, testimoniController.dleteTestimoni)
route.post('/update-testimoni/:id', verifyToken, isAdmin, testimoniController.updateTestimoni)
route.get('/user-all', testimoniController.getAllTestimoni)
route.get('/image/:id', profileController.getImageUrl)

module.exports = route;