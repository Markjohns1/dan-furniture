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
            <div className="page pb-safe-nav">
                <Header title="Account" />
                <div className="container-app py-12 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-user text-4xl text-gray-400"></i>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign in to your account</h2>
                    <p className="text-gray-500 mb-6">Access your orders and profile</p>
                    <div className="flex flex-col gap-3 max-w-xs mx-auto">
                        <Link to="/login" className="btn-primary">Sign In</Link>
                        <Link to="/register" className="btn-outline">Create Account</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page pb-safe-nav">
            <Header title="Profile" />

            <div className="container-app py-6">
                {/* User Header */}
                <div className="card p-6 mb-6 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-user text-primary-600 text-3xl"></i>
                    </div>
                    <h2 className="font-display text-xl font-bold text-gray-900">{user.full_name}</h2>
                    <p className="text-gray-500">{user.email}</p>
                    {isAdmin && (
                        <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                            <i className="fas fa-shield-alt mr-1"></i> Admin
                        </span>
                    )}
                </div>

                {/* Messages */}
                {message.text && (
                    <div className={`p-3 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                        <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}></i>
                        {message.text}
                    </div>
                )}

                {/* Edit Profile */}
                {editing ? (
                    <div className="card p-6 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Edit Profile</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="label">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="label">Phone Number</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="label">Delivery Address</label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="input min-h-[80px]"
                                    placeholder="Your default delivery address"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" disabled={loading} className="btn-primary flex-1">
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button type="button" onClick={() => setEditing(false)} className="btn-secondary flex-1">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="card divide-y divide-gray-100 mb-6">
                        <div className="p-4 flex justify-between items-center">
                            <div>
                                <span className="text-sm text-gray-500">Phone</span>
                                <p className="font-medium">{user.phone}</p>
                            </div>
                            <button onClick={() => setEditing(true)} className="text-primary-600 text-sm">
                                Edit
                            </button>
                        </div>
                        <div className="p-4">
                            <span className="text-sm text-gray-500">Address</span>
                            <p className="font-medium">{user.address || 'Not set'}</p>
                        </div>
                    </div>
                )}

                {/* Quick Links */}
                <div className="card divide-y divide-gray-100">
                    {!isAdmin && (
                        <Link to="/orders" className="flex items-center justify-between p-4 hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                                <i className="fas fa-box text-primary-600"></i>
                                <span className="font-medium">My Orders</span>
                            </div>
                            <i className="fas fa-chevron-right text-gray-400"></i>
                        </Link>
                    )}
                    {isAdmin && (
                        <Link to="/admin" className="flex items-center justify-between p-4 hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                                <i className="fas fa-chart-line text-primary-600"></i>
                                <span className="font-medium">Admin Dashboard</span>
                            </div>
                            <i className="fas fa-chevron-right text-gray-400"></i>
                        </Link>
                    )}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 p-4 text-red-600 w-full hover:bg-red-50"
                    >
                        <i className="fas fa-sign-out-alt"></i>
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
