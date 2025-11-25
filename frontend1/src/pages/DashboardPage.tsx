import { useAuthStore } from '../store/authStore';
import ParkingGrid from '../components/ParkingGrid';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);

    return (
        <div className="min-h-screen bg-gray-50 p-8 pb-24">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
                        <p className="text-gray-500 mt-1">Find and book your perfect parking spot</p>
                    </div>
                    <div className="flex gap-4">
                        {user?.role === 'admin' && (
                            <Link to="/admin" className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors">
                                Admin Panel
                            </Link>
                        )}
                        <Link to="/profile" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                            My Profile
                        </Link>
                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <ParkingGrid />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
