import express, { Router } from 'express';

const router: Router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Teknikoz University API is running' });
});

// TODO: Add contact routes
// router.use('/contacts', contactRoutes);
// router.use('/brochure-requests', brochureRoutes);

export default router;