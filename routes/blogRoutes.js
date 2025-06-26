const express = require('express');
const router = express.Router();
const blogController = require('../controller/blogController');
const {authenticateToken} = require('../middleware/auth');
const {uploadBlogImage} = require('../middleware/upload');

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/:id',authenticateToken, blogController.getBlogById);

// Protected routes
router.get('/my/blogs', authenticateToken, blogController.getMyBlogs);
router.post('/', authenticateToken, uploadBlogImage, blogController.createBlog);


router.use((req, res, next) => {
  console.log(`🔥 ${req.method} ${req.path} - Request received`);
  console.log('🔥 Headers:', JSON.stringify(req.headers, null, 2));
  next();
});

router.put(
  '/:id',
  (req, res, next) => {
    console.log('Received PUT request for blog update');
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Has file:', !!req.file);

    // FIX: Check if req.body exists before calling Object.keys()
    if (req.body && typeof req.body === 'object') {
      console.log('Body keys:', Object.keys(req.body));
      console.log('Body content:', req.body);
    } else {
      console.log('Body is:', typeof req.body, req.body);
    }

    next();
  },
  authenticateToken,
  uploadBlogImage,
  blogController.updateBlog,
);

router.patch('/:id/status', authenticateToken, blogController.updateBlogStatus);
router.delete('/:id', authenticateToken, blogController.deleteBlog);

module.exports = router;
