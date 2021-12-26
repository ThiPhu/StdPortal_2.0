const Announcement = require('../models/Announcement.model');
const User = require('../models/User.model');
const date = new Date();
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

// Xem chi tiết thông báo qua Id

// Tạo thông báo
exports.create = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const { title, content } = req.body;
    const file = req.file.filename;

    const create_date =
      date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    const create_time =
      date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    let newAnnounce = {
      title,
      content,
      file,
      create_date,
      create_time,
      user,
    };
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

// Xoá thông báo
