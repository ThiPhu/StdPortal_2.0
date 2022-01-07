const mongoose = require('mongoose');

// Defining schema
let Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    caption: String, // caption (The content of the post)
    image: String,
    video: String,
    // reaction: String, Optional
    create_date: String,
    create_time: String,
    isUpdated: {
      type: Boolean,
      default: false,
    },
    // user: [Object],
    user: {type:  Schema.Types.ObjectId, ref: 'Users'},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comments'}]
  },
  { timestamps: true }
);

const Post = mongoose.model('Posts', PostSchema);

module.exports = Post;
