const mongoose = require('mongoose');

const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || '';
const MONGODB_URI = process.env.MONGODB_URI.replace(
  '<password>',
  MONGODB_PASSWORD
);

const mongoDB = async () => {
  await mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connect successfully!'))
    .catch(err => console.log('MongoDB connection error:', err));
};
mongoDB();
