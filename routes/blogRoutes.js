const express = require("express");
const router = express.Router();
const blogController = require("../controller/blogController");
const { authenticateToken } = require("../middleware/auth");
const { uploadBlogImage } = require("../middleware/upload");



// Public routes
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);

// Protected routes
router.get("/my/blogs", authenticateToken, blogController.getMyBlogs);

router.post(
  "/",
  authenticateToken,
  uploadBlogImage,
  blogController.createBlog
);

router.put(
  "/:id",
  authenticateToken,
  uploadBlogImage,
  blogController.updateBlog
);

router.patch("/:id/status", authenticateToken, blogController.updateBlogStatus);

router.delete("/:id", authenticateToken, blogController.deleteBlog);

module.exports = router;
