// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const cookieParser = require("cookie-parser");

// const authRoutes = require("./routes/authRoutes");
// const blogRoutes = require("./routes/blogRoutes");

// const { syncDatabase } = require("./models/index");

// const app = express();

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(cookieParser());

// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:3001",
//       "http://127.0.0.1:3000",
//       "http://127.0.0.1:3001",
//       "http://localhost:5173",
//       "http://10.0.2.2:5000",
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// if (syncDatabase) {
//   syncDatabase();
// }

// // Body parsing middleware
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/posts", blogRoutes);

// app.get("/api/test", (req, res) => {
//   res.json({
//     success: true,
//     message: "Backend connection successful!",
//     timestamp: new Date().toISOString(),
//   });
// });

// // Health check
// app.get("/api/health", (req, res) => {
//   res.json({
//     success: true,
//     message: "Server is running!",
//     timestamp: new Date().toISOString(),
//   });
// });

// module.exports = app;
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const { syncDatabase } = require('./models/index');

const app = express();

// Serve static files (e.g., uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://localhost:5173',
      'http://10.0.2.2:5000',
      // Add your deployed frontend URL, e.g., 'https://your-frontend.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', blogRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend connection successful!',
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
  });
});

// Start server after database sync
const PORT = process.env.PORT || 3000;
syncDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server due to database error:', error);
    process.exit(1);
  });

module.exports = app;