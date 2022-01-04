const Announcement = require('../models/Announcement.model');
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
// Lấy toàn bộ thông báo
exports.get = async (req, res, next) => {
  const announces = await Announcement.find({});
  if (!announces) {
    return res.status(500).json({ ok: false, msg: 'Không tồn tại thông báo' });
  }
  return res.json({
    ok: true,
    message: 'Lấy thông báo thành công',
    announces: announces,
  });
};

// Xem chi tiết thông báo qua Id

// Tạo thông báo
exports.create = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const { title, content } = req.body;
    const date = new Date();
    const create_date =
      date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    const create_time = date.getHours() + ':' + date.getMinutes();

    // Nếu không phải là người dùng đăng nhập được trên trang này hay
    // không có tài khoản đăng nhập và không phải là Phòng/Khoa thì không cho tạo thông báo
    if (!user || (user.role !== 'faculty' && user.role !== 'admin')) {
      // return res.render('posts/post');
      return res.json({
        ok: false,
        msg: 'Tạo thông báo thất bại',
      });
    }

    let newAnnounce = await Announcement.create({
      title,
      content,
      create_date,
      create_time,
      user,
    });

    console.log(
      'From announcement.controller.js at create function: Tạo thông báo thành công'
    );

    return res.json({
      ok: true,
      msg: 'Tạo thông báo thành công!',
      data: newAnnounce,
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật thông báo
exports.update = async (req, res, next) => {
  const { title, content } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const announces = await Announcement.findById(req.params.announceId);
    const date = new Date();
    const create_date =
      date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    const create_time = date.getHours() + ':' + date.getMinutes();
    // Nếu không phải là chủ bài viết hoặc không có bài viết
    // hay user không login, thì không cho cập nhật
    if (
      !user ||
      !announces ||
      announces.user[0]._id.toString() !== user._id.toString() ||
      content.length <= 0
    ) {
      // return res.render('posts/post');
      return res.status(500).json({
        ok: false,
        msg: 'Không thể cập nhật thông báo',
      });
    }

    let newAnnounce = {
      title,
      content,
      create_date,
      create_time,
      isUpdated: true,
    };
    newAnnounce = await Announcement.findByIdAndUpdate(announces, newAnnounce, {
      new: true,
    });
    return res.json({
      ok: true,
      msg: 'Cập nhật bài viết thông báo!',
      announce: newAnnounce,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Xoá thông báo
exports.delete = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const id = req.params.announceId;
    const announce = await Announcement.findById(id).populate('user').lean();

    // Không là người dùng của trang
    // Không có tài khoản và không phải là Phòng/Khoa
    // Không trùng ID người dùng tạo thông báo thì sẽ không cho xoá
    if (user.role === 'admin') {
      await Announcement.findByIdAndDelete(id);

      console.log(
        'From announcement.controller.js at delete function: Xoá thông báo với tư cách admin thành công'
      );

      return res.json({
        ok: true,
        msg: 'Xoá thông báo thành công!',
        data: announce,
      });
    }

    if (
      !user ||
      user.role !== 'faculty' ||
      announce.user[0]._id.toString() !== req.user.id
    ) {
      // return res.render('posts/post');
      return res.status(500).json({
        ok: false,
        msg: 'Xoá thông báo thất bại',
      });
    }
    await Announcement.findByIdAndDelete(id);

    console.log(
      'From announcement.controller.js at delete function: Xoá thông báo thành công'
    );

    return res.json({
      ok: true,
      msg: 'Xoá thông báo thành công!',
      data: announce,
    });
  } catch (error) {
    next(error);
  }
};
