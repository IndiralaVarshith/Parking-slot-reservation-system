import { Request, Response } from 'express';
import ParkingSlot from '../models/ParkingSlot';
import Reservation from '../models/Reservation';
import User from '../models/User';

export const getAnalytics = async (req: Request, res: Response) => {
    try {
        const totalSlots = await ParkingSlot.countDocuments();
        const availableSlots = await ParkingSlot.countDocuments({ status: 'AVAILABLE' });
        const maintenanceSlots = await ParkingSlot.countDocuments({ status: 'MAINTENANCE' });

        const activeReservations = await Reservation.countDocuments({ status: 'CONFIRMED' });
        const totalReservations = await Reservation.countDocuments();

        // Calculate total revenue
        const revenueResult = await Reservation.aggregate([
            { $match: { status: { $in: ['CONFIRMED', 'COMPLETED'] } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        const totalUsers = await User.countDocuments({ role: 'user' });

        res.json({
            slots: {
                total: totalSlots,
                available: availableSlots,
                maintenance: maintenanceSlots,
            },
            reservations: {
                active: activeReservations,
                total: totalReservations,
            },
            revenue: totalRevenue,
            users: totalUsers,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics' });
    }
};
