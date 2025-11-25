import { useState } from 'react';
import { useSlots, ParkingSlot } from '../hooks/useSlots';
import SlotCard from './SlotCard';
import BookingModal from './BookingModal';
import { motion } from 'framer-motion';

const ParkingGrid = () => {
    const { data: slots, isLoading, error } = useSlots();
    const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    if (isLoading) return <div className="text-center py-10">Loading slots...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error loading slots</div>;

    const handleBookingSuccess = () => {
        setIsBookingModalOpen(false);
        setSelectedSlot(null);
        // Ideally refetch slots here or show success toast
        alert('Booking Confirmed!');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Select a Parking Slot</h2>
                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2"><span className="w-4 h-4 bg-green-100 border border-green-300 rounded"></span> Available</div>
                    <div className="flex items-center gap-2"><span className="w-4 h-4 bg-red-100 border border-red-300 rounded"></span> Blocked</div>
                    <div className="flex items-center gap-2"><span className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></span> Maintenance</div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
            >
                {slots?.map((slot) => (
                    <SlotCard
                        key={slot._id}
                        slot={slot}
                        isSelected={selectedSlot?._id === slot._id}
                        onSelect={setSelectedSlot}
                    />
                ))}
            </motion.div>

            {selectedSlot && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-0 left-0 right-0 bg-white p-6 shadow-2xl border-t border-gray-200 flex justify-between items-center z-40"
                >
                    <div>
                        <h3 className="text-lg font-bold">Selected: {selectedSlot.label}</h3>
                        <p className="text-gray-600">₹{selectedSlot.hourlyRate}/hr • {selectedSlot.size} Size</p>
                    </div>
                    <button
                        onClick={() => setIsBookingModalOpen(true)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        Book Now
                    </button>
                </motion.div>
            )}

            {isBookingModalOpen && selectedSlot && (
                <BookingModal
                    slot={selectedSlot}
                    onClose={() => setIsBookingModalOpen(false)}
                    onSuccess={handleBookingSuccess}
                />
            )}
        </div>
    );
};

export default ParkingGrid;
