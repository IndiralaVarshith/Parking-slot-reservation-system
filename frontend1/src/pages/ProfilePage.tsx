import { useAuthStore } from '../store/authStore';
import ReservationList from '../components/ReservationList';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
    const user = useAuthStore((state) => state.user);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link to="/" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">← Back to Dashboard</Link>
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Account Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Name</label>
                            <p className="text-lg text-gray-900">{user?.name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Email</label>
                            <p className="text-lg text-gray-900">{user?.email}</p>
                        </div>
                    </div>
                </div>

                <ReservationList />
            </div>
        </div>
    );
};

export default ProfilePage;
