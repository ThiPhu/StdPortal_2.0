const multer = require('multer');
const path = require('path');

// Define storage to stored image files
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../public/image/'),
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

module.exports = upload.single('image');
