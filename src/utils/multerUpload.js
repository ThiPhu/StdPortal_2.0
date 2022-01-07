const multer = require('multer');
const path = require('path');

// Define storage to stored image files
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../public/upload/'),
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb){
    let ext = path.extname(file.originalname)
    if(ext != '.png' || ext != '.jpg' || ext != '.gif' || ext != '.jpeg'){
      return cb(new Error("Chỉ cho phép file hình ảnh!"))
    }
      cb(null, true)
  },
});

module.exports = upload.single('file');
