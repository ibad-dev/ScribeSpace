import mongoose, { Schema } from 'mongoose';

const newsletterSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    isSubscribed: {
      type: Boolean,
      default: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const NewsLetter =  mongoose.model('Newsletter', newsletterSchema);


export default NewsLetter
