import { motion } from 'framer-motion';
import { ParkingSlot } from '../hooks/useSlots';
import { cn } from '../lib/utils';

interface SlotCardProps {
    slot: ParkingSlot;
    isSelected: boolean;
    onSelect: (slot: ParkingSlot) => void;
}

const SlotCard = ({ slot, isSelected, onSelect }: SlotCardProps) => {
    const statusColors = {
        AVAILABLE: 'bg-green-100 border-green-300 text-green-800',
        BLOCKED: 'bg-red-100 border-red-300 text-red-800',
        MAINTENANCE: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    };

    const isAvailable = slot.status === 'AVAILABLE';

    return (
        <motion.div
            whileHover={isAvailable ? { scale: 1.05 } : {}}
            whileTap={isAvailable ? { scale: 0.95 } : {}}
            onClick={() => isAvailable && onSelect(slot)}
            className={cn(
                'relative p-4 rounded-xl border-2 cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center h-32',
                statusColors[slot.status],
                isSelected && 'ring-4 ring-indigo-500 border-indigo-500',
                !isAvailable && 'cursor-not-allowed opacity-70'
            )}
        >
            <span className="font-bold text-lg">{slot.label}</span>
            <span className="text-xs mt-1">{slot.size} Size</span>
            <span className="text-xs font-semibold">₹{slot.hourlyRate}/hr</span>

            {isSelected && (
                <div className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
            )}
        </motion.div>
    );
};

export default SlotCard;
