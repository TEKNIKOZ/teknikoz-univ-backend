import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
// import swaggerUi from 'swagger-ui-express';
import apiRoutes from '@/routes';
// import { swaggerDocument, swaggerOptions } from '@/utils/swagger';

// Load environment variables
dotenv.config();

// Initialize database connection
import '@/config/database';

const app = express();

// Middleware
app.use(cors({
   credentials: true, // Allow cookies to be sent in cross-origin requests
   origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// API Routes
app.get('/', (req, res) => {
   res.json({ message: 'Welcome to Teknikoz University API' });
});

// API Routes with prefix
app.use('/api', apiRoutes);

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
   console.log(`Teknikoz University API Documentation available at http://localhost:${PORT}/api/docs`);
});

export default app; 