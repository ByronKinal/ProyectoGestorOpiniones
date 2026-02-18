import { Router } from 'express';
import {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
  getCommentById,
} from './comment.controller.js';
import {
  validateCreateComment,
  validateUpdateComment,
  validateCommentId,
  validatePostIdParam,
} from '../../middlewares/comment-validations.js';

const router = Router();

// GET /api/v1/comments/post/:postId (debe estar antes de /:commentId)
router.get('/post/:postId', validatePostIdParam, ...getCommentsByPost);

// POST /api/v1/comments/post/:postId
router.post('/post/:postId', validateCreateComment, ...createComment);

// GET /api/v1/comments/:commentId
router.get('/:commentId', validateCommentId, ...getCommentById);

// PUT /api/v1/comments/:commentId
router.put('/:commentId', validateUpdateComment, ...updateComment);

// DELETE /api/v1/comments/:commentId
router.delete('/:commentId', validateCommentId, ...deleteComment);

export default router;
