import { Router } from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
} from './post.controller.js';
import {
  validateCreatePost,
  validateUpdatePost,
  validatePostId,
} from '../../middlewares/post-validations.js';

const router = Router();

// GET /api/v1/posts
router.get('/', ...getAllPosts);

// GET /api/v1/posts/user/:userId
router.get('/user/:userId', ...getUserPosts);

// GET /api/v1/posts/:postId
router.get('/:postId', validatePostId, ...getPostById);

// POST /api/v1/posts
router.post('/', validateCreatePost, ...createPost);

// PUT /api/v1/posts/:postId
router.put('/:postId', validateUpdatePost, ...updatePost);

// DELETE /api/v1/posts/:postId
router.delete('/:postId', validatePostId, ...deletePost);

export default router;
