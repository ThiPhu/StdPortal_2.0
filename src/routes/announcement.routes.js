const Router = require('express').Router();
const multerUpload = require('../utils/multerUpload');
const announcementController = require('../controllers/announcement.controller');

// Tạo thông báo
Router.post('/', multerUpload, announcementController.create);

module.exports = Router;
