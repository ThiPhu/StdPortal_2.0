const Router = require('express').Router();
const announcementController = require('../controllers/announcement.controller');

// Lấy hết thông báo
Router.get('/', announcementController.get);

// Lấy thông báo qua id
Router.get('/:announceId', announcementController.getId);

// Tạo thông báo
Router.post('/', announcementController.create);

// Cập nhật thông báo
Router.put('/:announceId', announcementController.update);

// Xoá thông báo
Router.delete('/:announceId', announcementController.delete);

module.exports = Router;
