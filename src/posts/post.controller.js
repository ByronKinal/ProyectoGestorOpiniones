import { asyncHandler } from '../../middlewares/server-genericError-handler.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { Post } from './post.model.js';
import { Comment } from '../comments/comment.model.js';
import { findUserById } from '../../helpers/user-db.js';

/**
 * GET /api/v1/posts
 * Obtener todas las publicaciones con paginación
 */
export const getAllPosts = [
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, category, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalPosts = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Posts retrieved successfully',
      data: {
        posts,
        pagination: {
          total: totalPosts,
          pages: Math.ceil(totalPosts / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit),
        },
      },
    });
  }),
];

/**
 * GET /api/v1/posts/:postId
 * Obtener una publicación por ID con sus comentarios
 */
export const getPostById = [
  asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }

    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Post retrieved successfully',
      data: {
        post,
        comments,
      },
    });
  }),
];

/**
 * POST /api/v1/posts
 * Crear una nueva publicación
 */
export const createPost = [
  validateJWT,
  asyncHandler(async (req, res) => {
    const { title, category, content } = req.body;
    const userId = req.userId;

    // Obtener información del usuario
    const user = await findUserById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const newPost = new Post({
      userId,
      userName: user.Name,
      title,
      category: category || 'Other',
      content,
    });

    const savedPost = await newPost.save();

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: savedPost,
    });
  }),
];

/**
 * PUT /api/v1/posts/:postId
 * Editar una publicación (solo el propietario)
 */
export const updatePost = [
  validateJWT,
  asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { title, category, content } = req.body;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }

    // Verificar que el usuario sea el propietario
    if (post.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own posts',
      });
    }

    // Actualizar campos
    if (title) post.title = title;
    if (category) post.category = category;
    if (content) post.content = content;
    post.updatedAt = new Date();

    const updatedPost = await post.save();

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost,
    });
  }),
];

/**
 * DELETE /api/v1/posts/:postId
 * Eliminar una publicación (solo el propietario)
 */
export const deletePost = [
  validateJWT,
  asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }

    // Verificar que el usuario sea el propietario
    if (post.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own posts',
      });
    }

    // Eliminar la publicación y todos sus comentarios
    await Post.findByIdAndDelete(postId);
    await Comment.deleteMany({ postId });

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  }),
];

/**
 * GET /api/v1/posts/user/:userId
 * Obtener todas las publicaciones de un usuario
 */
export const getUserPosts = [
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalPosts = await Post.countDocuments({ userId });

    res.status(200).json({
      success: true,
      message: 'User posts retrieved successfully',
      data: {
        posts,
        pagination: {
          total: totalPosts,
          pages: Math.ceil(totalPosts / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit),
        },
      },
    });
  }),
];
