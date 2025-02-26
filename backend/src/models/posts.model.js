import mongoose, { Schema } from 'mongoose';
import slugify from 'slugify';

const postSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.Array,
      ref: 'User',
      required: true,
    },
    categories: [{ type: String, trim: true }],
    image: { type: String, default: '' },

    published: { type: Boolean, default: false },
    slug: { type: String, unique: true },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Add pre-save middleware to generate slug from title
postSchema.pre('save', function (next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = slugify(this.title, {
      lower: true, // Convert to lowercase
      strict: true, // Remove special characters
    });
  }
  next();
});

const Post = mongoose.model('Post', postSchema);

export default Post;
