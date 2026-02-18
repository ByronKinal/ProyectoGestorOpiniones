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

router.get('/post/:postId', validatePostIdParam, ...getCommentsByPost);

router.post('/post/:postId', validateCreateComment, ...createComment);

router.get('/:commentId', validateCommentId, ...getCommentById);

router.put('/:commentId', validateUpdateComment, ...updateComment);

router.delete('/:commentId', validateCommentId, ...deleteComment);

export default router;
