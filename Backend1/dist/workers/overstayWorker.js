"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startOverstayWorker = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const Reservation_1 = __importDefault(require("../models/Reservation"));
const logger_1 = __importDefault(require("../utils/logger"));
const startOverstayWorker = () => {
    // Run every 5 minutes
    node_cron_1.default.schedule('*/5 * * * *', async () => {
        logger_1.default.info('Running Overstay Worker...');
        try {
            const now = new Date();
            // Find active reservations (checked in, not completed/cancelled) that have passed their end time
            const overstays = await Reservation_1.default.find({
                status: 'CONFIRMED',
                checkInTime: { $exists: true },
                endDateTime: { $lt: now },
            }).populate('userId');
            for (const reservation of overstays) {
                const user = reservation.userId;
                if (user && user.phoneNumber) {
                    logger_1.default.info(`Overstay detected for reservation: ${reservation._id}. Sending notification to ${user.phoneNumber}`);
                    // TODO: Send SMS via Twilio or similar service
                    // sendSMS(user.phoneNumber, "Your parking reservation has expired. Please move your vehicle or extend.");
                }
            }
        }
        catch (error) {
            logger_1.default.error('Error in Overstay Worker:', error);
        }
    });
};
exports.startOverstayWorker = startOverstayWorker;
