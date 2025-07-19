import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import apiRoutes from '@/routes';
import { errorHandler, notFoundHandler } from '@/middlewares/errorHandler';
import { requestLogger } from '@/utils/logger';
import { swaggerDocument, swaggerOptions } from '@/utils/swagger';

// Load environment variables
dotenv.config();

// Initialize database connection
import '@/config/database';

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting middleware
const limiter = rateLimit({
   windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
   max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
   message: {
      success: false,
      message: 'Too many requests from this IP, please try again later.'
   },
   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use('/api/', limiter);

// CORS middleware
app.use(cors({
   credentials: true, // Allow cookies to be sent in cross-origin requests
   origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));

// Request logging
app.use(requestLogger);

// Cookie parser
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// API Routes
app.get('/', (_req, res) => {
   res.json({ message: 'Welcome to Teknikoz University API' });
});

// Body parsing middleware (applied before API routes)
app.use('/api', express.json({ limit: '10mb' }));
app.use('/api', express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes with prefix
app.use('/api', apiRoutes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
   console.log(`Teknikoz University API Documentation available at http://localhost:${PORT}/api-docs`);
});

export default app; 