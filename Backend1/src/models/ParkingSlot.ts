import mongoose, { Document, Schema } from 'mongoose';

export interface IParkingSlot extends Document {
    slotId: string;
    label: string;
    coordinates: { x: number; y: number };
    size: 'S' | 'M' | 'L';
    hourlyRate: number;
    status: 'AVAILABLE' | 'BLOCKED' | 'MAINTENANCE';
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

const ParkingSlotSchema: Schema = new Schema(
    {
        slotId: { type: String, required: true, unique: true },
        label: { type: String, required: true },
        coordinates: {
            x: { type: Number, required: true },
            y: { type: Number, required: true },
        },
        size: { type: String, enum: ['S', 'M', 'L'], required: true },
        hourlyRate: { type: Number, required: true },
        status: { type: String, enum: ['AVAILABLE', 'BLOCKED', 'MAINTENANCE'], default: 'AVAILABLE' },
        metadata: { type: Map, of: String },
    },
    { timestamps: true }
);

export default mongoose.model<IParkingSlot>('ParkingSlot', ParkingSlotSchema);
