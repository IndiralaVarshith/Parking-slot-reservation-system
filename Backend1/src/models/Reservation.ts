import mongoose, { Document, Schema } from 'mongoose';

export interface IReservation extends Document {
    userId: mongoose.Types.ObjectId;
    slotId: mongoose.Types.ObjectId;
    startDateTime: Date;
    endDateTime: Date;
    vehicleNumber?: string;
    totalAmount: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    paymentIntentId?: string;
    checkInTime?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ReservationSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        slotId: { type: Schema.Types.ObjectId, ref: 'ParkingSlot', required: true },
        startDateTime: { type: Date, required: true },
        endDateTime: { type: Date, required: true },
        vehicleNumber: { type: String },
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
            default: 'PENDING',
        },
        paymentIntentId: { type: String },
        checkInTime: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.model<IReservation>('Reservation', ReservationSchema);
