import mongoose, { Schema } from 'mongoose';

const likeSchema = new Schema(
  {
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  {
    timestamps: true,
    index: { post: 1, likedBy: 1 }, // Create compound index for faster queries
  },
 
);


const Like = mongoose.model('Like', likeSchema);

export default Like;
