import cron from 'node-cron';
import Reservation from '../models/Reservation';
import logger from '../utils/logger';

export const checkNoShows = async () => {
    logger.info('Running No-Show Worker...');
    try {
        const now = new Date();
        const twentyMinutesAgo = new Date(now.getTime() - 20 * 60 * 1000);

        // Find confirmed reservations that started more than 20 mins ago, haven't checked in, and aren't cancelled/completed
        const noShows = await Reservation.find({
            status: 'CONFIRMED',
            startDateTime: { $lt: twentyMinutesAgo },
            checkInTime: { $exists: false },
        });

        for (const reservation of noShows) {
            reservation.status = 'CANCELLED';
            await reservation.save();
            logger.info(`Auto-cancelled no-show reservation: ${reservation._id}`);
            // TODO: Trigger notification (email/SMS) to user about cancellation
        }
    } catch (error) {
        logger.error('Error in No-Show Worker:', error);
    }
};
