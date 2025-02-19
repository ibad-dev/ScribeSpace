import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  { timestamps: true, index: { post: 1 } }
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
