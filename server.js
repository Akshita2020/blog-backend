const app = require('./app');
// const { syncDatabase } = require('./models/index'); // Uncomment when models are ready

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    // Sync database (uncomment when models are ready)
    // await syncDatabase();
    // console.log('Database synced successfully!');

    // Start listening
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
