const blogService = require('../services/blogServices');
const {handleFileCleanup} = require('../utils/handleFileCleanup');

const blogController = {
  getAllBlogs: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 6;
      const search = req.query.search || '';

      const result = await blogService.getAllBlogs(page, limit, search);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Get all blogs error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching blogs',
      });
    }
  },

  getBlogById: async (req, res) => {
    try {
      const {id} = req.params;

      const userId = req.user?.id;
      const blog = await blogService.getBlogById(id, userId);

      console.log('Blog found:', blog.title);

      res.json({
        success: true,
        data: {blog},
      });
    } catch (error) {
      console.error('Get blog by ID error:', error);

      if (error.message === 'Invalid blog ID') {
        return res.status(400).json({
          success: false,
          message: error.message,
          errors: [{field: 'id', message: error.message}],
        });
      }

      if (error.message === 'Blog not found') {
        return res.status(404).json({
          success: false,
          message: error.message,
          errors: [{field: 'id', message: error.message}],
        });
      }

      res.status(500).json({
        success: false,
        message: 'Server error while fetching blog',
      });
    }
  },

  getMyBlogs: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const userId = req.user.id;

      const result = await blogService.getUserBlogs(userId, page, limit);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Get my blogs error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching your blogs',
      });
    }
  },

  createBlog: async (req, res) => {
    try {
      const {title, shortDescription, description, status} = req.body;
      const userId = req.user.id;

      const blogData = {
        userId,
        title: title.trim(),
        shortDescription: shortDescription ? shortDescription.trim() : '',
        description: description.trim(),
        status: status || 'active',
      };

      const newBlog = await blogService.createBlog(blogData, req.file, req);

      res.status(201).json({
        success: true,
        message: 'Blog created successfully',
        data: {blog: newBlog},
      });
    } catch (error) {
      console.error('Create blog error:', error);

      handleFileCleanup(req.file);

      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(err => ({
          field: err.path,
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Server error while creating blog',
      });
    }
  },

  updateBlog: async (req, res) => {
    try {
      const {id} = req.params;
      const {title, shortDescription, description, status, removeImage} =
        req.body;
      const userId = req.user.id;

      const updateData = {
        title: title.trim(),
        shortDescription: shortDescription ? shortDescription.trim() : '',
        description: description.trim(),
        status: status,
        removeImage: removeImage === 'true' || removeImage === true,
      };

      const updatedBlog = await blogService.updateBlog(
        id,
        userId,
        updateData,
        req.file,
        req,
      );

      res.json({
        success: true,
        message: 'Blog updated successfully',
        data: {blog: updatedBlog},
      });
    } catch (error) {
      console.error('Update blog error:', error);

      handleFileCleanup(req.file);

      if (
        error.message.includes('Invalid') ||
        error.message.includes('not found') ||
        error.message.includes('authorized')
      ) {
        const statusCode = error.message.includes('Invalid')
          ? 400
          : error.message.includes('not found')
          ? 404
          : 403;

        return res.status(statusCode).json({
          success: false,
          message: error.message,
          errors: [{field: error.field || 'general', message: error.message}],
        });
      }

      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(err => ({
          field: err.path,
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Server error while updating blog',
        errors: [{field: 'server', message: 'Internal server error'}],
      });
    }
  },

  updateBlogStatus: async (req, res) => {
    try {
      const {id} = req.params;
      const {status} = req.body;
      const userId = req.user.id;

      const updatedBlog = await blogService.updateBlogStatus(
        id,
        userId,
        status,
      );

      res.json({
        success: true,
        message: 'Blog status updated successfully',
        data: {blog: updatedBlog},
      });
    } catch (error) {
      console.error('Status update error:', error);

      if (
        error.message.includes('Invalid') ||
        error.message.includes('not found') ||
        error.message.includes('authorized')
      ) {
        const statusCode = error.message.includes('Invalid')
          ? 400
          : error.message.includes('not found')
          ? 404
          : 403;

        return res.status(statusCode).json({
          success: false,
          message: error.message,
          errors: [{field: 'general', message: error.message}],
        });
      }

      res.status(500).json({
        success: false,
        message: 'Server error while updating status',
        errors: [{field: 'server', message: 'Internal server error'}],
      });
    }
  },

  deleteBlog: async (req, res) => {
    try {
      const {id} = req.params;
      const userId = req.user.id;

      await blogService.deleteBlog(id, userId, req);

      res.json({
        success: true,
        message: 'Blog deleted successfully',
      });
    } catch (error) {
      console.error('Delete blog error:', error);

      if (
        error.message.includes('not found') ||
        error.message.includes('authorized')
      ) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Server error while deleting blog',
      });
    }
  },

  searchBlogs: async (req, res) => {
    try {
      const {q: query, page = 1, limit = 10} = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required',
        });
      }

      const result = await blogService.searchBlogs(
        query,
        parseInt(page),
        parseInt(limit),
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Search blogs error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while searching blogs',
      });
    }
  },
};

module.exports = blogController;
