import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, getDBStatus } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import studentRoutes from './routes/studentRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import verificationRoutes from './routes/verificationRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import authRoutes from './routes/authRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'CampusID — Digital College ID Management System API',
    mongoConnected: getDBStatus(),
    razorpayConfigured: Boolean(
      process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes('your_')
    ),
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/payment', paymentRoutes);

// Error Handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 CampusID Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 Ready for frontend requests on port ${PORT}`);
});
