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
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Posts',
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comments', CommentSchema);

module.exports = Comment
