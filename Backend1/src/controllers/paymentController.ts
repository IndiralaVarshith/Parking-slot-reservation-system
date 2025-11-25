import { Request, Response } from 'express';
import Stripe from 'stripe';
import Reservation from '../models/Reservation';
import logger from '../utils/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2023-10-16',
});

export const stripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
        // In a real app, verify the signature using the raw body
        // For now, we'll trust the body (DEV ONLY) or assume it's verified by middleware
        event = req.body;
    } catch (err) {
        logger.error(`Webhook Error: ${(err as Error).message}`);
        return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            const reservationId = paymentIntent.metadata.reservationId;

            logger.info(`Payment succeeded for reservation: ${reservationId}`);

            if (reservationId) {
                await Reservation.findByIdAndUpdate(reservationId, { status: 'CONFIRMED' });
            }
            break;
        case 'payment_intent.payment_failed':
            const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
            const resId = paymentIntentFailed.metadata.reservationId;
            if (resId) {
                await Reservation.findByIdAndUpdate(resId, { status: 'CANCELLED' });
            }
            break;
        default:
            logger.info(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
};
