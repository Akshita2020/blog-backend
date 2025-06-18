const { Blog, User } = require("../models/index");
const { Op } = require("sequelize");
const { handleImageUpload, deleteImage } = require("../utils/handleImageUpload");

const blogService = {

  getAllBlogs: async (page, limit, search) => {
    const offset = (page - 1) * limit;

    const whereClause = {
      status: "active",
      ...(search && {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { shortDescription: { [Op.like]: `%${search}%` } },
        ],
      }),
    };

    const { count, rows: blogs } = await Blog.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email"],
        },
      ],
      attributes: ["id", "title", "shortDescription", "image", "createdAt"],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      blogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalBlogs: count,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },
    };
  },

  getBlogById: async (id, userId) => {
    // Validate ID
    if (!id || isNaN(id)) {
      throw new Error("Invalid blog ID");
    }

    let whereClause = { id };

    // If no user or not the owner, only show active blogs
    if (!userId) {
      whereClause.status = "active";
    }

    const blog = await Blog.findOne({
      where: whereClause,
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!blog) {
      throw new Error("Blog not found");
    }

    // If blog is not active and user is not the owner, deny access
    if (blog.status !== "active" && (!userId || blog.userId !== userId)) {
      throw new Error("Blog not found");
    }

    return blog;
  },

  getUserBlogs: async (userId, page, limit) => {
    const offset = (page - 1) * limit;

    const { count, rows: blogs } = await Blog.findAndCountAll({
      where: { userId },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email"],
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      blogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalBlogs: count,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },
    };
  },

  createBlog: async (blogData, file, req) => {
    // Handle image upload
    let imageUrl = null;
    if (file) {
      imageUrl = handleImageUpload(file, req);
    }

    const newBlog = await Blog.create({
      ...blogData,
      image: imageUrl,
    });

    // Fetch the created blog with author details
    const blogWithAuthor = await Blog.findByPk(newBlog.id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    return blogWithAuthor;
  },

  updateBlog: async (id, userId, updateData, file, req) => {
    // Validate ID
    if (!id || isNaN(id)) {
      const error = new Error("Invalid blog ID");
      error.field = "id";
      throw error;
    }

    const blog = await Blog.findByPk(id);

    if (!blog) {
      const error = new Error("Blog not found");
      error.field = "id";
      throw error;
    }

    // Check if user owns this blog
    if (blog.userId !== userId) {
      const error = new Error("You can only edit your own blogs");
      error.field = "authorization";
      throw error;
    }

    // Handle image update
    let imageUrl = blog.image; 

    if (file) {
      // Delete old image if it exists
      if (blog.image) {
        deleteImage(blog.image, req);
      }
      // Set new image URL
      imageUrl = handleImageUpload(file, req);
    } else if (updateData.removeImage) {
      // Remove existing image
      if (blog.image) {
        deleteImage(blog.image, req);
      }
      imageUrl = null;
    }

    // Update the blog
    await blog.update({
      title: updateData.title,
      shortDescription: updateData.shortDescription,
      description: updateData.description,
      status: updateData.status || blog.status,
      image: imageUrl,
    });

    // Fetch updated blog with author details
    const updatedBlog = await Blog.findByPk(blog.id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    return updatedBlog;
  },

  updateBlogStatus: async (id, userId, status) => {
    // Validate ID
    if (!id || isNaN(id)) {
      throw new Error("Invalid blog ID");
    }

    // Validate status
    if (!status || !["active", "inactive"].includes(status)) {
      throw new Error("Status must be either 'active' or 'inactive'");
    }

    // Find blog
    const blog = await Blog.findByPk(id);
    if (!blog) {
      throw new Error("Blog not found");
    }

    // Check ownership
    if (blog.userId !== userId) {
      throw new Error("Not authorized to update this blog");
    }

    // Update status only
    await blog.update({ status });

    // Fetch updated blog with author
    const updatedBlog = await Blog.findByPk(id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    return updatedBlog;
  },

  deleteBlog: async (id, userId, req) => {
    const blog = await Blog.findOne({ where: { id, userId } });

    if (!blog) {
      throw new Error(
        "Blog not found or you are not authorized to delete this blog"
      );
    }

    // Delete associated image file
    if (blog.image) {
      deleteImage(blog.image, req);
    }

    await blog.destroy();
  },

  searchBlogs: async (query, page, limit) => {
    const offset = (page - 1) * limit;

    const { count, rows: blogs } = await Blog.findAndCountAll({
      where: {
        status: "active",
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { shortDescription: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } },
        ],
      },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email"],
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      blogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalBlogs: count,
        limit,
      },
    };
  },
};

module.exports = blogService;
