const mongoose = require('mongoose');

// Defining Schema
let Schema = mongoose.Schema;

const AnnouncementSchema = new Schema(
  {
    title: String, // header
    content: String, // body
    file: [String],
    create_date: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcements', AnnouncementSchema);
