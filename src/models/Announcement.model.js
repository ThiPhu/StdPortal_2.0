const mongoose = require('mongoose');

// Defining Schema
let Schema = mongoose.Schema;

const AnnouncementSchema = new Schema(
  {
    title: String, // header for the announcement from faculty
    content: String, // body (can be use at header if it post from regular user)
    file: [String],
    create_date: String,
    create_time: String,
    user: [Object],
  },
  { timestamps: true }
);

const Announcement = mongoose.model('Announcements', AnnouncementSchema);

module.exports = Announcement;
