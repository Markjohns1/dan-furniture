/**
 * Dan Classic Furniture - Profile Page
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/layout/Header';

export default function Profile() {
    const { user, isAuthenticated, isAdmin, logout, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        phone: user?.phone || '',
        address: user?.address || '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await updateProfile(formData);
        if (result.success) {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setEditing(false);
        } else {
            setMessage({ type: 'error', text: result.error });
        }
        setLoading(false);
    };

    if (!isAuthenticated) {
        return (
            <div className="page pb-safe-nav bg-gray-50 flex items-center justify-center min-h-screen">
                <Header title="Account" />
                <div className="w-full max-w-sm mx-auto p-8 card text-center shadow-lg">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-user text-3xl text-gray-400"></i>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Sign In</h2>
                    <p className="text-gray-500 mb-8 text-sm">Access your profile, orders, and more.</p>
                    <div className="flex flex-col gap-3">
                        <Link to="/login" className="btn-primary w-full shadow-md">Sign In</Link>
                        <Link to="/register" className="btn-outline w-full">Create Account</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page pb-safe-nav bg-gray-50 min-h-[calc(100vh-64px)]">
            <Header title="Profile" />

            {/* Added pt-8 AND mt-8 to ensure visual separation from fixed/sticky header */}
            <div className="container-app py-6 mt-6 flex items-start justify-center">
                <div className="w-full max-w-lg">
                    {/* Main Profile Card */}
                    <div className="card overflow-hidden shadow-xl border-t-4 border-primary-600">
                        {/* Header Section */}
                        <div className="bg-white p-8 text-center relative">
                            {isAdmin && (
                                <div className="absolute top-4 right-4 bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    Admin
                                </div>
                            )}

                            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center shadow-inner border-2 border-white">
                                <span className="font-display text-4xl text-primary-700 font-bold">
                                    {user.full_name?.charAt(0) || 'U'}
                                </span>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.full_name}</h2>
                            <p className="text-gray-500 text-sm mb-6">{user.email}</p>

                            {/* Stats/Quick Info Row */}
                            {!isAdmin && (
                                <div className="flex justify-center gap-8 border-t border-gray-100 pt-6">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-gray-900">0</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">Orders</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-gray-900">0</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">Pending</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Messages */}
                        {message.text && (
                            <div className={`mx-6 mt-4 p-3 rounded-lg text-sm flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2 text-lg`}></i>
                                {message.text}
                            </div>
                        )}

                        {/* Content Section */}
                        <div className="p-6 md:p-8">
                            {editing ? (
                                <form onSubmit={handleSubmit} className="space-y-5 animate-fadeIn">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="label text-xs uppercase tracking-wider text-gray-500 mb-1 block">Full Name</label>
                                            <div className="relative">
                                                <i className="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                                                <input
                                                    type="text"
                                                    value={formData.full_name}
                                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                                    className="input input-with-icon h-10 w-full"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="label text-xs uppercase tracking-wider text-gray-500 mb-1 block">Phone Number</label>
                                            <div className="relative">
                                                <i className="fas fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="input input-with-icon h-10 w-full"
                                                    placeholder="07..."
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="label text-xs uppercase tracking-wider text-gray-500 mb-1 block">Delivery Address</label>
                                            <div className="relative">
                                                <i className="fas fa-map-marker-alt absolute left-3 top-3 text-gray-400 pointer-events-none"></i>
                                                <textarea
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                    className="input input-with-icon min-h-[80px] py-2 w-full leading-relaxed"
                                                    placeholder="Your default delivery address"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button type="submit" disabled={loading} className="btn-primary flex-1 shadow-md">
                                            {loading ? <span className="flex items-center justify-center gap-2"><i className="fas fa-spinner fa-spin"></i> Saving...</span> : 'Save Changes'}
                                        </button>
                                        <button type="button" onClick={() => setEditing(false)} className="btn-secondary flex-1">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-1">
                                    <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between group hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm group-hover:text-primary-600 transition-colors">
                                                <i className="fas fa-phone"></i>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Phone</p>
                                                <p className="text-gray-900 font-medium">{user.phone}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-primary-600 transition-colors p-2">
                                            <i className="fas fa-pen"></i>
                                        </button>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between group hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm group-hover:text-primary-600 transition-colors">
                                                <i className="fas fa-map-marker-alt"></i>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Address</p>
                                                <p className="text-gray-900 font-medium">{user.address || 'No address set'}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-primary-600 transition-colors p-2">
                                            <i className="fas fa-pen"></i>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Actions List */}
                            <div className="mt-8 space-y-2 border-t border-gray-100 pt-6">
                                {!isAdmin && (
                                    <Link to="/orders" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-primary-600 group">
                                        <div className="flex items-center gap-3">
                                            <i className="fas fa-box w-6 text-center text-gray-400 group-hover:text-primary-500 transition-colors"></i>
                                            <span className="font-medium">My Orders</span>
                                        </div>
                                        <i className="fas fa-chevron-right text-gray-300 group-hover:text-primary-400 text-sm"></i>
                                    </Link>
                                )}
                                {isAdmin && (
                                    <Link to="/admin" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-primary-600 group">
                                        <div className="flex items-center gap-3">
                                            <i className="fas fa-chart-line w-6 text-center text-gray-400 group-hover:text-primary-500 transition-colors"></i>
                                            <span className="font-medium">Admin Dashboard</span>
                                        </div>
                                        <i className="fas fa-chevron-right text-gray-300 group-hover:text-primary-400 text-sm"></i>
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-red-50 transition-colors text-gray-700 hover:text-red-600 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <i className="fas fa-sign-out-alt w-6 text-center text-gray-400 group-hover:text-red-500 transition-colors"></i>
                                        <span className="font-medium">Logout</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-6">
                        <Link to="/" className="text-sm text-gray-500 hover:text-primary-600 transition-colors inline-flex items-center gap-2">
                            <i className="fas fa-arrow-left"></i> Back to Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
