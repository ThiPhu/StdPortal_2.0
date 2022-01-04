const multer = require('multer');
const path = require('path');
const cloudinary_config = require('../config/cloudinary.config');
const cloudinary = require('cloudinary').v2;

// Define storage to stored image files
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../public/image/'),
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  cloudinary: cloudinary_config,
  params: {
    folder: 'thetaStorage/images',
  },
});

const upload = multer({
  storage: storage,
});

module.exports = upload.single('image');
