import cron from 'node-cron';
import Reservation from '../models/Reservation';
import logger from '../utils/logger';

export const checkOverstays = async () => {
    logger.info('Running Overstay Worker...');
    try {
        const now = new Date();

        // Find active reservations (checked in, not completed/cancelled) that have passed their end time
        const overstays = await Reservation.find({
            status: 'CONFIRMED',
            checkInTime: { $exists: true },
            endDateTime: { $lt: now },
        }).populate('userId');

        for (const reservation of overstays) {
            const user = reservation.userId as any;
            if (user && user.phoneNumber) {
                logger.info(`Overstay detected for reservation: ${reservation._id}. Sending notification to ${user.phoneNumber}`);
                // TODO: Send SMS via Twilio or similar service
                // sendSMS(user.phoneNumber, "Your parking reservation has expired. Please move your vehicle or extend.");
            }
        }
    } catch (error) {
        logger.error('Error in Overstay Worker:', error);
    }
};
