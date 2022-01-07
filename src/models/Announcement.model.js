const mongoose = require('mongoose');

// Defining Schema
let Schema = mongoose.Schema;

const AnnouncementSchema = new Schema(
  {
    title: String,
    content: String, // body (can be use at header if it post from regular user)
    create_date: String,
    create_time: String,
    user: [Object],
    sections: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Sections' }],
    },
    isUpdated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Announcement = mongoose.model('Announcements', AnnouncementSchema);

module.exports = Announcement;
