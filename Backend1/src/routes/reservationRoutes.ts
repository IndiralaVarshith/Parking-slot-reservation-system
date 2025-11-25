import express from 'express';
import { createReservation, getMyReservations, cancelReservation, checkIn } from '../controllers/reservationController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect); // All routes require auth

router.post('/', createReservation);
router.get('/my', getMyReservations);
router.post('/:id/cancel', cancelReservation);
router.post('/:id/checkin', checkIn);

export default router;
