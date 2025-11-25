import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Link, Navigate } from 'react-router-dom';

interface AnalyticsData {
    slots: {
        total: number;
        available: number;
        maintenance: number;
    };
    reservations: {
        active: number;
        total: number;
    };
    revenue: number;
    users: number;
}

const AdminDashboard = () => {
    const user = useAuthStore((state) => state.user);

    const { data: analytics, isLoading } = useQuery({
        queryKey: ['admin-analytics'],
        queryFn: async () => {
            const { data } = await api.get<AnalyticsData>('/admin/analytics');
            return data;
        },
    });

    if (user?.role !== 'admin') {
        return <Navigate to="/" />;
    }

    if (isLoading) return <div className="p-8">Loading analytics...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <Link to="/" className="text-indigo-600 hover:text-indigo-800">Back to App</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">₹{analytics?.revenue}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 text-sm font-medium">Active Reservations</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{analytics?.reservations.active}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{analytics?.users}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 text-sm font-medium">Available Slots</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{analytics?.slots.available} / {analytics?.slots.total}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold mb-4">Slot Management</h2>
                    <p className="text-gray-500 mb-4">Manage parking slots, update status, or add new ones.</p>
                    {/* Slot Management UI to be implemented */}
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                        Manage Slots
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
