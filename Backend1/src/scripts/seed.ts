import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import ParkingSlot from '../models/ParkingSlot';
import bcrypt from 'bcryptjs';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/parking-system');
        console.log('MongoDB Connected for Seeding');

        // Clear existing data
        await User.deleteMany({});
        await ParkingSlot.deleteMany({});

        // Create Admin User
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('admin123', salt);

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            passwordHash,
            role: 'admin',
            phoneNumber: '1234567890'
        });
        console.log('Admin User Created:', admin.email);

        // Create Test User
        const userPasswordHash = await bcrypt.hash('user123', salt);
        const user = await User.create({
            name: 'Test User',
            email: 'user@example.com',
            passwordHash: userPasswordHash,
            role: 'user',
            phoneNumber: '0987654321'
        });
        console.log('Test User Created:', user.email);

        // Create Parking Slots
        const slots = [];
        for (let i = 1; i <= 20; i++) {
            slots.push({
                slotId: `slot-${i}`,
                label: `A-${i}`,
                coordinates: { x: i * 10, y: 0 },
                size: i <= 5 ? 'L' : 'M',
                hourlyRate: i <= 5 ? 20 : 10,
                status: 'AVAILABLE'
            });
        }
        await ParkingSlot.insertMany(slots);
        console.log(`${slots.length} Parking Slots Created`);

        console.log('Seeding Completed Successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding Failed:', error);
        process.exit(1);
    }
};

seed();
