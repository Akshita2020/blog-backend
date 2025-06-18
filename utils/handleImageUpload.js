const fs = require("fs");
const path = require("path");

const handleImageUpload = (file, req) => {
  if (!file) return null;

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/blogs/${
    file.filename
  }`;
  return imageUrl;
};

const deleteImage = (imageUrl, req) => {
  if (!imageUrl) return;
  try {
    const imagePath = imageUrl.replace(
      `${req.protocol}://${req.get("host")}/`,
      ""
    );
    const fullImagePath = path.join(__dirname, "..", imagePath);

    fs.unlink(fullImagePath, (err) => {
      if (err) {
        console.error("Error deleting image file:", err);
      } else {
        console.log("Image deleted successfully:", fullImagePath);
      }
    });
  } catch (error) {
    console.error("Error processing image deletion:", error);
  }
};

module.exports = { handleImageUpload, deleteImage };
