import { body, validationResult, param } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array(),
    });
  }
  next();
};

export const validateCreatePost = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  
  body('category')
    .optional()
    .isIn(['Technology', 'Politics', 'Sports', 'Entertainment', 'Education', 'Health', 'Business', 'Other'])
    .withMessage('Invalid category'),
  
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Content must be between 10 and 5000 characters'),
  
  handleValidationErrors,
];

export const validateUpdatePost = [
  param('postId')
    .notEmpty()
    .withMessage('Post ID is required')
    .isMongoId()
    .withMessage('Invalid post ID format'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  
  body('category')
    .optional()
    .isIn(['Technology', 'Politics', 'Sports', 'Entertainment', 'Education', 'Health', 'Business', 'Other'])
    .withMessage('Invalid category'),
  
  body('content')
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Content must be between 10 and 5000 characters'),
  
  handleValidationErrors,
];

export const validatePostId = [
  param('postId')
    .notEmpty()
    .withMessage('Post ID is required')
    .isMongoId()
    .withMessage('Invalid post ID format'),
  
  handleValidationErrors,
];
