"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startNoShowWorker = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const Reservation_1 = __importDefault(require("../models/Reservation"));
const logger_1 = __importDefault(require("../utils/logger"));
const startNoShowWorker = () => {
    // Run every minute
    node_cron_1.default.schedule('* * * * *', async () => {
        logger_1.default.info('Running No-Show Worker...');
        try {
            const now = new Date();
            const twentyMinutesAgo = new Date(now.getTime() - 20 * 60 * 1000);
            // Find confirmed reservations that started more than 20 mins ago, haven't checked in, and aren't cancelled/completed
            const noShows = await Reservation_1.default.find({
                status: 'CONFIRMED',
                startDateTime: { $lt: twentyMinutesAgo },
                checkInTime: { $exists: false },
            });
            for (const reservation of noShows) {
                reservation.status = 'CANCELLED';
                await reservation.save();
                logger_1.default.info(`Auto-cancelled no-show reservation: ${reservation._id}`);
                // TODO: Trigger notification (email/SMS) to user about cancellation
            }
        }
        catch (error) {
            logger_1.default.error('Error in No-Show Worker:', error);
        }
    });
};
exports.startNoShowWorker = startNoShowWorker;
