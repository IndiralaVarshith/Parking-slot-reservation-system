import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { motion } from 'framer-motion';

interface Reservation {
    _id: string;
    slotId: {
        _id: string;
        label: string;
    };
    startDateTime: string;
    endDateTime: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    totalAmount: number;
    vehicleNumber: string;
}

const ReservationList = () => {
    const queryClient = useQueryClient();
    const { data: reservations, isLoading, error } = useQuery({
        queryKey: ['my-reservations'],
        queryFn: async () => {
            const { data } = await api.get<Reservation[]>('/reservations/my-reservations');
            return data;
        },
    });

    const cancelMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.post(`/reservations/${id}/cancel`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-reservations'] });
        },
    });

    if (isLoading) return <div>Loading reservations...</div>;
    if (error) return <div className="text-red-500">Error loading reservations</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">My Reservations</h2>
            {reservations?.length === 0 ? (
                <p className="text-gray-500">No reservations found.</p>
            ) : (
                reservations?.map((res) => (
                    <motion.div
                        key={res._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-4 rounded-lg shadow border border-gray-200 flex justify-between items-center"
                    >
                        <div>
                            <h3 className="font-bold text-lg">{res.slotId.label}</h3>
                            <p className="text-sm text-gray-600">
                                {new Date(res.startDateTime).toLocaleString()} - {new Date(res.endDateTime).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">Vehicle: {res.vehicleNumber}</p>
                            <span className={`inline-block px-2 py-1 text-xs rounded mt-2 ${res.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                    res.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                }`}>
                                {res.status}
                            </span>
                        </div>

                        {res.status === 'CONFIRMED' && (
                            <button
                                onClick={() => {
                                    if (confirm('Are you sure you want to cancel?')) {
                                        cancelMutation.mutate(res._id);
                                    }
                                }}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                                Cancel
                            </button>
                        )}
                    </motion.div>
                ))
            )}
        </div>
    );
};

export default ReservationList;
