const { check } = require('express-validator');
const { handleValidationResult } = require('../utils/handleValidationResult');

exports.image = [
  check('image').custom((value, { req }) => {
    let image = req.file;
    if (!image) {
      image = null;
    } else {
      image = req.file;
    }

    // Nếu bài viết không có ảnh thỉ sẽ cho up nội dung
    if (image === null) {
      return true;
    }
    console.log(image.size / (1024 * 1024).toFixed(2) + 'MB');
    // if (image.size / (1024 * 1024).toFixed(2) >= 10) {
    //   throw new Error('Sai định dạng ảnh hoặc dung lượng ảnh quá lớn');
    // }

    // Xét điều kiện nếu bài viết tồn tại ảnh

    console.log(      ['image/jpeg', 'image/gif', 'image/png'].filter(t => {
      t == image.mimetype;
    }).length == -1)

    if (
      ['image/jpeg', 'image/gif', 'image/png'].filter(t => {
        t == image.mimetype;
      }).length == -1
    ) {
      throw new Error('Sai định dạng ảnh');
    } else {
      return true;
    }
  }),
  (req, res, next) => handleValidationResult(req, res, next),
];
