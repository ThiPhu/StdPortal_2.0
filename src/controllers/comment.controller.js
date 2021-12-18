const Comment = require('../models/Comment.model');
const Post = require('../models/Post.model');
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Arp',
  'May',
  'Jun',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

// Lấy bình luận qua ID ( Dành cho admin quản lý )
exports.getCommentId = async (req, res, next) => {
  const id = req.params.id;
  if (req.user.role !== 'admin') {
    return res.redirect('/');
  }
  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.json({ ok: false, msg: 'Không tìm thấy bình luận' });
    }
    return res.json({
      ok: true,
      msg: `Trả về comment ${id} thành công!`,
      comment: comment,
    });
  } catch (err) {
    next(err);
  }
};

// Tạo bình luận
exports.create = async (req, res, next) => {
  const { content, postId } = req.body;

  const user = req.user;
  console.log(req.body);
  try {
    const post = await Post.findById(postId);

    const date = new Date();
    const create_date =
      date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    const create_time =
      date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    // Nếu không tìm thấy bài viết, hay user không tìm thấy thì sẽ không cho comment
    if (!post || !user) {
      return res.json({ ok: false, msg: 'Không thể tạo bình luận' });
    }

    const newComment = await Comment.create({
      content,
      create_date,
      create_time,
      postId,
      user,
      date,
    });

    post.comments.push(newComment);

    await post.save();

    console.log(
      'From comment.controller.js at create function: Tạo bình luận thành công'
    );
    return res.json({
      ok: true,
      msg: 'Tạo bình luận thành công!',
      data: newComment,
    });
  } catch (err) {
    next(err);
  }
};

// Cập nhật bình luận
exports.update = async (req, res, next) => {};

// Xoá bình luận
exports.delete = async (req, res, next) => {
  const id = req.params.id;
  try {
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) {
      return res.json({ ok: false, msg: 'Không tìm thấy bình luận' });
    }
    return res.json({
      ok: true,
      msg: 'Xoá bình luận thành công',
      comment: comment,
    });
  } catch (err) {
    next(err);
  }
};
