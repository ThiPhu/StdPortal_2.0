const Router = require('express').Router();
const commentController = require('../controllers/comment.controller');

Router.get('/:id', commentController.getCommentId);

Router.post('/', commentController.create);

Router.put('/:id', commentController.update);

Router.delete('/:id', commentController.delete);

module.exports = Router;
