import mongoose, { Schema } from 'mongoose';

const contactSchema = new Schema(
  {
    name: {
      required: true,
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
