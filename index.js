// Khai báo package
const dotenv = require('dotenv').config({ path: './.env' });
const Handlebars = require('handlebars');
const rateLimit = require('express-rate-limit');
const exphbs = require('express-handlebars');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access'); // This will allow 'own property' in Handlebars data
// Connect to MONGODB
require('./src/config/database.config.js');

const app = express();
const PORT = process.env.PORT || 8080;

// Sử dụng tính năng rate limit trong express để phòng chống tấn công DDOS.
const limiter = rateLimit({
  windowMs: 15 * 60 * 60 * 1000, // 15 minutes
  max: 100, // Giới hạn mỗi IP chỉ cho 100 request ( Đơn vị windowMs )
});

// Cors chia sẻ tài nguyên chéo liên quan đến bảo mật ngăn chặn truy cập tài nguyên của các domain khác
app.use(cors());
// app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Limit kiểm soát số lượng request body

// Khai báo folder public để thêm styling và scripts
app.use(express.static('public'));

// Khai báo view engine
app.engine(
  'hbs',
  exphbs({
    defaultLayout: 'main',
    layoutsDir: __dirname + '/src/views/layouts/',
    partialsDir: __dirname + '/src/views/partials/',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    extname: '.hbs',
    helpers: {},
  })
);
app.set('view engine', 'hbs');

// Đặt đường dẫn là views vì default của view engine chỉ nhận folder từ root
app.set('views', path.join(__dirname, 'src/views'));

// session ( valid in 1 day)
app.use(
  session({
    secret: 'meow',
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false,
  })
);

app.use(cookieParser());

// cloudinary
require('./src/config/cloudinary.config');

// app.use(passport.initialize());
require('./src/config/passport.config');

const route = require('./src/routes');
route(app);

app.listen(PORT, () => console.log(`Server is online at ${PORT}`));
