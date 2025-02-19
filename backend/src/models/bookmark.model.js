import mongoose, { Schema } from 'mongoose';

const bookmarkSchema = new Schema(
  {
    bookmarkedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  { timestamps: true }
);
const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;
