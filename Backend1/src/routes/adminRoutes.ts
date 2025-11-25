import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware';
import { getAnalytics } from '../controllers/adminController';

const router = express.Router();

router.get('/analytics', protect, admin, getAnalytics);

export default router;
