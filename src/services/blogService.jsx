import api from './api';

const blogService = {
  // Fetch all public blogs
  fetchAllBlogs: async (page = 1, limit = 10, search = '') => {
    try {
      const response = await api.get('/posts', {
        params: {page, limit, search},
      });
      return response.data;
    } catch (error) {
      console.error('fetchAllBlogs error:', error);
      throw error;
    }
  },

  // Get blog by ID
  getBlogById: async id => {
    try {
      const response = await api.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('getBlogById error:', error);
      throw error;
    }
  },

  // Get user's blogs
  getMyBlogs: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/posts/my/blogs', {
        params: {page, limit},
      });
      return response.data;
    } catch (error) {
      console.error('getMyBlogs error:', error);
      throw error;
    }
  },

  // Create new blog
  createBlog: async (blogData, imageUri) => {
    try {
      const formData = new FormData();

      // Add blog data to form
      Object.keys(blogData).forEach(key => {
        if (blogData[key] !== null && blogData[key] !== undefined) {
          formData.append(key, blogData[key]);
        }
      });

      // Add image if provided
      if (imageUri) {
        const imageFile = {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'blog-image.jpg',
        };
        formData.append('image', imageFile);
      }
      const response = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('createBlog error:', error);
      throw error;
    }
  },

  // Update blog
  updateBlog: async (id, blogData, imageUri) => {
    try {
      const formData = new FormData();

      // Add blog data to form
      Object.keys(blogData).forEach(key => {
        if (blogData[key] !== null && blogData[key] !== undefined) {
          formData.append(key, blogData[key]);
        }
      });

      // Add image if provided
      if (imageUri) {
        const imageFile = {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'blog-image.jpg',
        };
        formData.append('image', imageFile);
      }

      const response = await api.put(`/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('updateBlog error:', error);
      throw error;
    }
  },

  // Update blog status
  updateBlogStatus: async (id, status) => {
    try {
      const response = await api.patch(`/posts/${id}/status`, {status});
      return response.data;
    } catch (error) {
      console.error('updateBlogStatus error:', error);
      throw error;
    }
  },

  // Delete blog
  deleteBlog: async id => {
    try {
      const response = await api.delete(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('deleteBlog error:', error);
      throw error;
    }
  },

};

export default blogService;

