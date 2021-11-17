const mongoose = require('mongoose');

// Defining schema
let Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: String, // Header
    caption: String, // caption
    images: String,
    // reaction: String, Optional
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

const Post = mongoose.model('Posts', PostSchema);

module.exports = Post
