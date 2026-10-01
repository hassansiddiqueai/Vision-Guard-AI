const express = require('express');
const cors = require('cors');
const path = require('path');
const env = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const inspectionRoutes = require('./routes/inspectionRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Middlewares
app.use(cors({
  origin: env.CLIENT_URL || '*',
  credentials: true,
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'VisionGuard AI Intelligence Core',
    version: '2.4.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api', apiRoutes);

// Error Handling Middleware (must be registered last)
app.use(errorHandler);

const PORT = env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`  VisionGuard AI Backend Engine Online`);
  console.log(`  Port: ${PORT} | Env: ${env.NODE_ENV}`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`========================================`);
});
