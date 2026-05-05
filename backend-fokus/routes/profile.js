const express = require('express');
const route = express.Router();
const profileController = require('../controllers/profileController');
const fileController = require('../controllers/fileController');
const { verifyToken } = require('../middlewares/verify');
const { formUpdateProfile } = require('../middlewares/validation');

route.post('/update-profile', verifyToken, formUpdateProfile, profileController.updateProfile);
route.post('/upload-file', verifyToken, fileController.uploadFile);

module.exports = route;