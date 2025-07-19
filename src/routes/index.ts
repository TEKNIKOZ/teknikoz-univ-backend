import express, { Router } from 'express';
import contactRoutes from './contactRoutes';
import brochureRoutes from './brochureRoutes';
import authRoutes from './authRoutes';

const router: Router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Teknikoz University API",
    status: "running",
    timestamp: new Date().toISOString()
  });
});

router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "teknikoz-university-api",
    timestamp: new Date().toISOString()
  });
});


router.use('/auth', authRoutes);
router.use('/contacts', contactRoutes);
router.use('/brochure-requests', brochureRoutes);


export default router;