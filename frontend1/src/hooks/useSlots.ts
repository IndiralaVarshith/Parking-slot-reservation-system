import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export interface ParkingSlot {
    _id: string;
    slotId: string;
    label: string;
    coordinates: { x: number; y: number };
    size: 'S' | 'M' | 'L';
    hourlyRate: number;
    status: 'AVAILABLE' | 'BLOCKED' | 'MAINTENANCE';
}

export const useSlots = () => {
    return useQuery({
        queryKey: ['slots'],
        queryFn: async () => {
            const { data } = await api.get<ParkingSlot[]>('/slots');
            return data;
        },
    });
};
