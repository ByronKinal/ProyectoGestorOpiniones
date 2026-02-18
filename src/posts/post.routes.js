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

router.get('/', ...getAllPosts);

router.get('/user/:userId', ...getUserPosts);

router.get('/:postId', validatePostId, ...getPostById);

router.post('/', validateCreatePost, ...createPost);

router.put('/:postId', validateUpdatePost, ...updatePost);

router.delete('/:postId', validatePostId, ...deletePost);

export default router;
