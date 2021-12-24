const mongoose = require('mongoose');

// Defining Schema
let Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    content: String, // body
    // reaction: String, Optional
    create_date: {
      type: Date,
      default: Date.now,
    },
    userId: [Object],
    postId: [Object],
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comments', CommentSchema);

module.exports = Comment;
