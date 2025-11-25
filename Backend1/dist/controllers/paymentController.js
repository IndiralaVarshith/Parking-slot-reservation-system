"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhook = void 0;
const stripe_1 = __importDefault(require("stripe"));
const Reservation_1 = __importDefault(require("../models/Reservation"));
const logger_1 = __importDefault(require("../utils/logger"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2023-10-16',
});
const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        // In a real app, verify the signature using the raw body
        // For now, we'll trust the body (DEV ONLY) or assume it's verified by middleware
        event = req.body;
    }
    catch (err) {
        logger_1.default.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            const reservationId = paymentIntent.metadata.reservationId;
            logger_1.default.info(`Payment succeeded for reservation: ${reservationId}`);
            if (reservationId) {
                await Reservation_1.default.findByIdAndUpdate(reservationId, { status: 'CONFIRMED' });
            }
            break;
        case 'payment_intent.payment_failed':
            const paymentIntentFailed = event.data.object;
            const resId = paymentIntentFailed.metadata.reservationId;
            if (resId) {
                await Reservation_1.default.findByIdAndUpdate(resId, { status: 'CANCELLED' });
            }
            break;
        default:
            logger_1.default.info(`Unhandled event type ${event.type}`);
    }
    res.json({ received: true });
};
exports.stripeWebhook = stripeWebhook;
