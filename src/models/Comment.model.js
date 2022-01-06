const mongoose = require('mongoose');

// Defining Schema
let Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    content: String, // body
    // reaction: String, Optional
    create_date: String,
    create_time: String,
    user: {type: Schema.Types.ObjectId, ref:"Users"},
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comments', CommentSchema);

module.exports = Comment;
