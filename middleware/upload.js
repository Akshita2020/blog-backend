const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directory exists function
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, {recursive: true});
    console.log(`Created directory: ${dirPath}`);
  }
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/blogs/';
    console.log('Multer: Setting destination path:', uploadPath);
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const fileName = file.fieldname + '-' + uniqueSuffix + fileExtension;
    console.log('Multer: Generated filename:', fileName);
    cb(null, fileName);
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  console.log('Multer: File filter - checking file:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    fieldname: file.fieldname,
    size: file.size,
  });

  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    console.log('Multer: File accepted ✅');
    return cb(null, true);
  } else {
    console.log('Multer: File rejected ❌ - Invalid type');
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Error handling middleware
const handleMulterError = (err, req, res, next) => {
  console.log('Multer: Error occurred:', err.message);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.',
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name. Expected "image".',
      });
    }
  }

  if (err.message.includes('Only image files are allowed')) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next(err);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1, 
  },
  fileFilter: fileFilter,
});

const createUploadMiddleware = fieldName => {
  return (req, res, next) => {
   

    const uploadSingle = upload.single(fieldName);

    uploadSingle(req, res, err => {
      if (err) {
        console.log(`Multer: Upload error for ${fieldName}:`, err.message);
        return handleMulterError(err, req, res, next);
      }

      if (req.file) {
        console.log(`Multer: File details:`, {
          fieldname: req.file.fieldname,
          originalname: req.file.originalname,
          filename: req.file.filename,
          mimetype: req.file.mimetype,
          size: req.file.size,
          path: req.file.path,
        });
      } else {
        console.log(
          `Multer: No file uploaded (this is OK for updates without new images)`,
        );
      }

      // Log body content
      if (req.body && Object.keys(req.body).length > 0) {
        console.log(`Multer: Form fields received:`, Object.keys(req.body));
        console.log(`Multer: Form data:`, req.body);
      } else {
        console.log(`Multer: No form fields received`);
      }

      next();
    });
  };
};

// Export different upload configurations
module.exports = {
  // Basic multer instance
  upload,

  // Individual middleware functions
  uploadSingle: createUploadMiddleware('image'),
  uploadMultiple: upload.array('images', 5),
  uploadBlogImage: createUploadMiddleware('image'),
  uploadUserAvatar: createUploadMiddleware('avatar'),

  // Error handler
  handleMulterError,

  // Utility functions
  ensureDirectoryExists,

  // For manual use if needed
  multerInstance: upload,
};
