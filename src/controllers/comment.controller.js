const Comment = require('../models/Comment.model');
const Post = require('../models/Post.model');
const User = require('../models/User.model');
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

// Lấy bình luận theo post ID
exports.get = async (req, res, next) => {
  const postId = req.params.id

  try {
    const comment = await Comment.find({postId:postId}).sort({createdAt:-1});
    if (!comment) {
      return res.json({ ok: false, msg: 'Không tìm thấy post' });
    }
    return res.json({
      ok: true,
      msg: `Trả về comment cho post ${postId} thành công!`,
      comment: comment,
    });
  } catch (err) {
    next(err);
  }
};

// Tạo bình luận
exports.create = async (req, res, next) => {
  // Đầu vào là postId sẽ là ẩn, và nội dung bình luận
  const { content, postId } = req.body;


  console.log("POSTID",postId)

  const user = {_id: req.user._id, fullname: req.user.fullname, avatar: req.user.avatar};
  console.log("User info", user)
  try {
    const post = await Post.findById(postId);

    const date = new Date();
    const create_date =
      date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    const create_time = date.getHours() + ':' + date.getMinutes();

    // Nếu không tìm thấy bài viết, hay user không tìm thấy thì sẽ không cho comment
    if (!post || !user || content.length <= 0) {
      return res.json({ ok: false, msg: 'Không thể tạo bình luận' });
    }

    const newComment = await Comment.create({
      content,
      create_date,
      create_time,
      postId,
      user:user,
      // date,
    });
    console.log("post",post)
    // Đẩy bình luận vào bài viết người dùng mới nhập vào
    post.comments.push(newComment._id);

    // Lưu lại bài viết có bình luận đó
    await post.save();

    console.log(
      'From comment.controller.js at create function: Tạo bình luận thành công'
    );

    return res.json({ ok: true, msg: 'Tạo bình luận thành công!' });
  } catch (err) {
    next(err);
  }
};

// Cập nhật bình luận
exports.update = async (req, res, next) => {
  // Đầu vào là postId sẽ là ẩn, và nội dung bình luận
  const { content, postId } = req.body;
  const commentId = req.params.id;

  try {
    const user = await User.findById(req.user.id);

    const comment = await Comment.findById(commentId);
    const post = await Post.findById(postId);
    const date = new Date();
    const create_date =
      date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    const create_time = date.getHours() + ':' + date.getMinutes();
    // Nếu không tìm thấy bài viết, hay user - comment không tìm thấy thì sẽ không cho comment

    if (
      !post ||
      !user ||
      content.length <= 0 ||
      !comment ||
      !comment.user._id.toString() === req.user.id
    ) {
      return res
        .status(500)
        .json({ ok: false, msg: 'Không thể cập nhật bình luận' });
    }

    let newComment = {
      content,
      create_date,
      create_time,
    };

    // // Tìm bình luận bên trong comments array của bài viết
    // newComment = await Comment.findByIdAndUpdate(comment, newComment, {
    //   new: true,
    // });

    // // Xoá đi bình luận cũ và tạo lại bình luận mới kèm theo boolean cho cập nhật
    // // Tìm bình luận bên trong comments array của bài viết
    // const removeIndex = post.comments.findIndex(
    //   c => c._id.toString() === commentId
    // );

    // post.comments.splice(removeIndex, 1);

    // post.comments.push(newComment);

    // // Đẩy bình luận vào bài viết người dùng mới nhập vào

    // // Lưu lại bài viết có bình luận đó
    // await post.save();

    const update = await Comment.findByIdAndUpdate(
        {_id:commentId},
        newComment
      )
      console.log("UPDATE",update)
    if(update){
      return res.json({
        ok: true,
        msg: 'Cập nhật bình luận thành công',
        comment: newComment,
      });
    }
    console.log(
      'From comment.controller.js function update: Cập nhật bình luận thành công'
    );

  } catch (error) {}
};

// Xoá bình luận
exports.delete = async (req, res, next) => {
  // Đầu vào là postId sẽ là ẩn
  const { postId } = req.body;
  const commentId = req.params.id;
  console.log(postId, commentId);
  try {
    const post = await Post.findById(postId);
    // Xoá comment trong database
    const comment = await Comment.findById(commentId);

    // Trả về 404 nếu không tìm thấy bình luận
    if (!comment) {
      return res.json({ ok: false, msg: 'Không tìm thấy bình luận' });
    }

    // Tìm bình luận bên trong comments array của bài viết
    const removeIndex = post.comments.findIndex(
      c => c._id.toString() === commentId
    );

    if (!comment.user._id.toString() === req.user.id) {
      return res.json({
        ok: false,
        msg: 'Không thể xoá bình luận !',
      });
    }

    await Comment.findByIdAndDelete(commentId);

    post.comments.splice(removeIndex, 1);
    await post.save();
    return res.json({
      ok: true,
      msg: 'Xoá bình luận thành công',
      comment: comment,
    });
  } catch (err) {
    next(err);
  }
};
