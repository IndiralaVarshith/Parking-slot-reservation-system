import { Request, Response } from 'express';
import Reservation from '../models/Reservation';
import ParkingSlot from '../models/ParkingSlot';
import { acquireLock, releaseLock } from '../utils/lock';
import logger from '../utils/logger';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2023-10-16',
});

interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const createReservation = async (req: AuthRequest, res: Response) => {
    const { slotId, startDateTime, endDateTime, vehicleNumber } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    const lockKey = `lock:slot:${slotId}`;
    const lockAcquired = await acquireLock(lockKey, 10000); // 10 seconds lock

    if (!lockAcquired) {
        return res.status(409).json({ message: 'Slot is currently being booked by another user. Please try again.' });
    }

    try {
        // 1. Check if slot exists
        const slot = await ParkingSlot.findById(slotId);
        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        // 2. Check availability (Overlap check)
        const start = new Date(startDateTime);
        const end = new Date(endDateTime);

        const existingReservation = await Reservation.findOne({
            slotId,
            status: { $in: ['CONFIRMED', 'PENDING'] },
            $or: [
                { startDateTime: { $lt: end }, endDateTime: { $gt: start } }, // Overlaps
            ],
        });

        if (existingReservation) {
            return res.status(400).json({ message: 'Slot is not available for the selected time range' });
        }

        // 3. Calculate Amount
        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        const totalAmount = durationHours * slot.hourlyRate;

        // 4. Create Reservation
        const reservation = await Reservation.create({
            userId,
            slotId,
            startDateTime: start,
            endDateTime: end,
            vehicleNumber,
            totalAmount,
            status: 'PENDING', // Will be CONFIRMED after payment
        });

        // 5. Create Stripe PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100), // Amount in cents
            currency: 'inr',
            metadata: {
                reservationId: reservation._id.toString(),
                userId: userId,
            },
        });

        reservation.paymentIntentId = paymentIntent.id;
        await reservation.save();

        res.status(201).json({
            reservation,
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        await releaseLock(lockKey);
    }
};

export const getMyReservations = async (req: AuthRequest, res: Response) => {
    try {
        const reservations = await Reservation.find({ userId: req.user?.id }).populate('slotId');
        res.json(reservations);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const cancelReservation = async (req: AuthRequest, res: Response) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        if (reservation.userId.toString() !== req.user?.id && req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        reservation.status = 'CANCELLED';
        await reservation.save();

        res.json({ message: 'Reservation cancelled' });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const checkIn = async (req: AuthRequest, res: Response) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        if (reservation.userId.toString() !== req.user?.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Check if within valid time window (e.g., 15 mins before start)
        const now = new Date();
        const start = new Date(reservation.startDateTime);

        // Simple check: can check in if it's past start time (or close to it) and not cancelled
        if (reservation.status !== 'CONFIRMED') {
            return res.status(400).json({ message: 'Reservation is not confirmed' });
        }

        reservation.checkInTime = now;
        await reservation.save();

        res.json({ message: 'Checked in successfully', reservation });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
