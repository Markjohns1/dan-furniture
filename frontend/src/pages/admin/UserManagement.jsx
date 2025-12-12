/**
 * Dan Classic Furniture - Admin User Management Page
 * Allows admin to create and view other admin/customer accounts
 */
import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import Header from '../../components/layout/Header';
import BottomNav from '../../components/layout/BottomNav';
import { LoadingSpinner } from '../../components/ui/Loading';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        password: '',
        full_name: '',
        role: 'admin',
        address: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await adminAPI.getCustomers({ limit: 100 });
            setUsers(res.data.users || []);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        try {
            await adminAPI.createUser(formData);
            setSuccess('User created successfully!');
            setFormData({
                email: '',
                phone: '',
                password: '',
                full_name: '',
                role: 'admin',
                address: ''
            });
            setShowForm(false);
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to create user');
        } finally {
            setSubmitting(false);
        }
    };

    const adminUsers = users.filter(u => u.role === 'admin');
    const customerUsers = users.filter(u => u.role === 'customer');

    return (
        <div className="page pb-20 lg:pb-8">
            <Header title="User Management" showBack />

            <div className="container-app py-6 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Team &amp; Users</h1>
                        <p className="text-sm text-gray-500">Manage admin accounts and view customers</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-primary !py-2 !px-4 !text-sm"
                    >
                        <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'} mr-2`}></i>
                        {showForm ? 'Cancel' : 'Add User'}
                    </button>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-100">
                        <i className="fas fa-check-circle mr-2"></i>{success}
                    </div>
                )}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-100">
                        <i className="fas fa-exclamation-circle mr-2"></i>{error}
                    </div>
                )}

                {/* Add User Form */}
                {showForm && (
                    <div className="card p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New User</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Full Name</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        className="input"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="input"
                                        placeholder="0712345678"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="input"
                                        placeholder="Min 6 characters"
                                        minLength={6}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Role</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="input"
                                        required
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="customer">Customer</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Address (Optional)</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="input"
                                        placeholder="Nairobi, Kenya"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn-primary"
                                >
                                    {submitting ? (
                                        <>
                                            <LoadingSpinner size="sm" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-user-plus mr-2"></i>
                                            Create User
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Admin Users */}
                        <div className="card overflow-hidden">
                            <div className="p-4 bg-primary-50 border-b border-primary-100">
                                <h2 className="font-semibold text-primary-900 flex items-center gap-2">
                                    <i className="fas fa-user-shield"></i>
                                    Admin Accounts ({adminUsers.length})
                                </h2>
                            </div>
                            {adminUsers.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    No admin users yet
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {adminUsers.map((user) => (
                                        <div key={user.id} className="p-4 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                                                <i className="fas fa-user-shield text-primary-600"></i>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{user.full_name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded uppercase">
                                                    Admin
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Customer Users */}
                        <div className="card overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b border-gray-100">
                                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <i className="fas fa-users"></i>
                                    Customers ({customerUsers.length})
                                </h2>
                            </div>
                            {customerUsers.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    No customers yet
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {customerUsers.slice(0, 10).map((user) => (
                                        <div key={user.id} className="p-4 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                <i className="fas fa-user text-gray-500"></i>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{user.full_name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded uppercase">
                                                    Customer
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {customerUsers.length > 10 && (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            And {customerUsers.length - 10} more customers...
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
