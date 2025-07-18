import express, { Router } from 'express';
import contactRoutes from './contactRoutes';
import brochureRoutes from './brochureRoutes';
import userRoutes from './userRoutes';
import authRoutes from './authRoutes';

const router: Router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Teknikoz University API is running' });
});

// Auth routes - handle all auth endpoints with better-auth
router.use('/auth', authRoutes);

// User routes
router.use('/users', userRoutes);

// Contact routes
router.use('/contacts', contactRoutes);

// Brochure request routes
router.use('/brochure-requests', brochureRoutes);

export default router;