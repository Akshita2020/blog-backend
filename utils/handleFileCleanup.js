const fs = require("fs");

const handleFileCleanup = (file) => {
  if (file && file.path) {
    fs.unlink(file.path, (err) => {
      if (err) console.error("Error deleting file:", err);
    });
  }
};

module.exports = { handleFileCleanup };
