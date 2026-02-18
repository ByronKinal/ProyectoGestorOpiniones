import { asyncHandler } from '../../middlewares/server-genericError-handler.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { Comment } from './comment.model.js';
import { Post } from '../posts/post.model.js';
import { findUserById } from '../../helpers/user-db.js';

/**
 * GET /api/v1/posts/:postId/comments
 * Obtener todos los comentarios de una publicación
 */
export const getCommentsByPost = [
  asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Verificar que la publicación existe
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }

    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalComments = await Comment.countDocuments({ postId });

    res.status(200).json({
      success: true,
      message: 'Comments retrieved successfully',
      data: {
        comments,
        pagination: {
          total: totalComments,
          pages: Math.ceil(totalComments / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit),
        },
      },
    });
  }),
];

/**
 * POST /api/v1/posts/:postId/comments
 * Crear un nuevo comentario
 */
export const createComment = [
  validateJWT,
  asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    // Verificar que la publicación existe
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }

    // Obtener información del usuario
    const user = await findUserById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const newComment = new Comment({
      postId,
      userId,
      userName: user.Name,
      content,
    });

    const savedComment = await newComment.save();

    // Incrementar contador de comentarios en la publicación
    post.commentsCount = (post.commentsCount || 0) + 1;
    await post.save();

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: savedComment,
    });
  }),
];

/**
 * PUT /api/v1/comments/:commentId
 * Editar un comentario (solo el propietario)
 */
export const updateComment = [
  validateJWT,
  asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: 'Comment not found' });
    }

    // Verificar que el usuario sea el propietario
    if (comment.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own comments',
      });
    }

    comment.content = content;
    comment.updatedAt = new Date();

    const updatedComment = await comment.save();

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      data: updatedComment,
    });
  }),
];

/**
 * DELETE /api/v1/comments/:commentId
 * Eliminar un comentario (solo el propietario)
 */
export const deleteComment = [
  validateJWT,
  asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.userId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: 'Comment not found' });
    }

    // Verificar que el usuario sea el propietario
    if (comment.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own comments',
      });
    }

    const postId = comment.postId;

    // Eliminar el comentario
    await Comment.findByIdAndDelete(commentId);

    // Decrementar contador de comentarios en la publicación
    const post = await Post.findById(postId);
    if (post && post.commentsCount > 0) {
      post.commentsCount -= 1;
      await post.save();
    }

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  }),
];

/**
 * GET /api/v1/comments/:commentId
 * Obtener un comentario por ID
 */
export const getCommentById = [
  asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: 'Comment not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Comment retrieved successfully',
      data: comment,
    });
  }),
];
