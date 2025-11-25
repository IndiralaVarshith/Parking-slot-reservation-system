"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = void 0;
const ParkingSlot_1 = __importDefault(require("../models/ParkingSlot"));
const Reservation_1 = __importDefault(require("../models/Reservation"));
const User_1 = __importDefault(require("../models/User"));
const getAnalytics = async (req, res) => {
    try {
        const totalSlots = await ParkingSlot_1.default.countDocuments();
        const availableSlots = await ParkingSlot_1.default.countDocuments({ status: 'AVAILABLE' });
        const maintenanceSlots = await ParkingSlot_1.default.countDocuments({ status: 'MAINTENANCE' });
        const activeReservations = await Reservation_1.default.countDocuments({ status: 'CONFIRMED' });
        const totalReservations = await Reservation_1.default.countDocuments();
        // Calculate total revenue
        const revenueResult = await Reservation_1.default.aggregate([
            { $match: { status: { $in: ['CONFIRMED', 'COMPLETED'] } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
        const totalUsers = await User_1.default.countDocuments({ role: 'user' });
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching analytics' });
    }
};
exports.getAnalytics = getAnalytics;
