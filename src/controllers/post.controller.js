const User = require('../models/User.model');
const Post = require('../models/Post.model');
const Comment = require('../models/Comment.model');
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

// Lấy tất cả bài viết
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().lean().populate('comments');
    // return res.render('posts/post', { post });
    res.json({
      ok: true,
      msg: 'Trả về các bài viết thành công!',
      posts: posts,
    });
  } catch (err) {
    next(err);
  }
};

// Lấy bài viết theo ID
exports.getPostId = async (req, res, next) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ ok: false, msg: 'No post found' });
    // return res.render('posts/post', { post });
    return res.json({
      ok: true,
      msg: `Trả về bài viết ${postId} thành công!`,
      post: post,
    });
  } catch (err) {
    next(err);
  }
};

// Tạo bài viết mới
exports.create = async (req, res, next) => {
  const { caption } = req.body;
  let video = req.body.video;
  let image = req.file;

  if (!image) {
    image = null;
  } else {
    image = image.path;
  }
  if (!video) {
    video = null;
  }
  const user = req.user;
  try {
    const userId = await User.findById(req.user.id);
    const date = new Date();
    const create_date =
      date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    const create_time =
      date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    // Nếu không phải là người dùng đăng nhập được trên trang này hay
    // không có tài khoản đăng nhập thì không cho tạo bài viết
    if (!userId || (caption.length <= 0 && image === null && video === null)) {
      // return res.render('posts/post');
      return res.status(500).json({
        ok: false,
        msg: 'Tạo bài viết thất bại',
      });
    }

    const post = await Post.create({
      caption,
      image,
      video,
      user,
      create_date,
      create_time,
    });

    console.log(
      'From post.controller.js at create function: Tạo bài viết thành công'
    );
    return res.json({
      ok: true,
      msg: 'Tạo bài bài viết thành công!',
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

// Cập nhật bài viết
exports.update = async (req, res, next) => {
  const { caption } = req.body;
  let video = req.body.video;
  let image = req.file;

  try {
    const user = await User.findById(req.user.id);
    const post = await Post.findById(req.params.id);
    const date = new Date();
    const create_date =
      date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    const create_time = date.getHours() + ':' + date.getMinutes();
    // Nếu không phải là chủ bài viết hoặc không có bài viết
    // hay user không login, thì không cho cập nhật
    if (
      !user ||
      !post ||
      post.user[0]._id.toString() !== user._id.toString() ||
      (caption.length <= 0 && image === null)
    ) {
      // return res.render('posts/post');
      return res.status(500).json({
        ok: false,
        msg: 'Không thể cập nhật bài viết',
      });
    }
    if (!image) {
      image = post.image;
    } else {
      image = image.path;
    }
    if (!video) {
      video = post.video;
    }
    // res.render('posts/post');
    let newPost = {
      caption,
      image,
      video,
      create_date,
      create_time,
      isUpdated: true,
    };
    newPost = await Post.findByIdAndUpdate(post, newPost, { new: true });
    return res.json({
      ok: true,
      msg: 'Cập nhật bài viết thành công!',
      post: newPost,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Xoá bài viết
exports.delete = async (req, res, next) => {
  const postId = req.params.id;
  const user = req.user;
  try {
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(500)
        .json({ ok: false, msg: 'Không tìm thấy bài viết' });

    if (req.user.role === 'admin') {
      // Xoá post và tất cả bình luận bên trong
      await Post.findByIdAndDelete(postId);
      await Comment.find({ postId }).deleteMany();
      return res.json({
        ok: true,
        msg: `Đã xoá bài viết ${postId} thành công!`,
        post: post,
      });
    }

    if (!user || post.user[0]._id.toString() !== user._id.toString()) {
      return res.status(500).json({
        ok: false,
        msg: 'Người dùng không hợp lệ hoặc người dùng không có quyền xoá bài viết này',
      });
    } // Role admin có thể xoá hết

    // Xoá post và tất cả bình luận bên trong
    await Post.findByIdAndDelete(postId);
    await Comment.find({ postId }).deleteMany();

    return res.json({
      ok: true,
      msg: `Đã xoá bài viết ${postId} thành công!`,
      post: post,
    });
  } catch (err) {
    next(err);
  }
};
