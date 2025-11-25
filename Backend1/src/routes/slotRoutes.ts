import express from 'express';
import { getSlots, getSlotById, createSlot, updateSlot, deleteSlot } from '../controllers/slotController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/')
    .get(getSlots)
    .post(protect, admin, createSlot);

router.route('/:id')
    .get(getSlotById)
    .put(protect, admin, updateSlot)
    .delete(protect, admin, deleteSlot);

export default router;
