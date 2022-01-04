const cloudinary = require('cloudinary').v2;

const { CloudinaryStorage } = require('multer-storage-cloudinary');

const multer = require('multer');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Upload',
    resource_type: 'auto',
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
