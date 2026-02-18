import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    userName: {
      type: String,
      required: [true, 'Username is required'],
    },
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title must not exceed 200 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Technology', 'Politics', 'Sports', 'Entertainment', 'Education', 'Health', 'Business', 'Other'],
      default: 'Other',
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
      trim: true,
      minlength: [10, 'Content must be at least 10 characters'],
      maxlength: [5000, 'Content must not exceed 5000 characters'],
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'posts',
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

// Índices para mejora de rendimiento
postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ title: 'text', content: 'text' });

export const Post = mongoose.model('Post', postSchema);
