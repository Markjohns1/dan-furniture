/**
 * Dan Classic Furniture - Admin Dashboard
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api';
import Header from '../../components/layout/Header';
import { LoadingSpinner } from '../../components/ui/Loading';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            adminAPI.getDashboard(),
            adminAPI.getRecentOrders(5),
            adminAPI.getLowStock(5),
        ])
            .then(([statsRes, ordersRes, stockRes]) => {
                setStats(statsRes.data);
                setRecentOrders(ordersRes.data);
                setLowStock(stockRes.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="page pb-safe-nav">
                <Header title="Dashboard" />
                <div className="flex items-center justify-center py-20">
                    <LoadingSpinner size="lg" />
                </div>
            </div>
        );
    }

    return (
        <div className="page pb-safe-nav">
            <Header title="Dashboard" />

            <div className="container-app py-6">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <Link to="/admin/products/new" className="card-hover p-4 text-center">
                        <div className="w-12 h-12 mx-auto mb-2 bg-primary-100 rounded-xl flex items-center justify-center">
                            <i className="fas fa-plus text-primary-600 text-xl"></i>
                        </div>
                        <span className="font-medium text-sm">Add Product</span>
                    </Link>
                    <Link to="/admin/orders" className="card-hover p-4 text-center">
                        <div className="w-12 h-12 mx-auto mb-2 bg-accent-100 rounded-xl flex items-center justify-center">
                            <i className="fas fa-box text-accent-600 text-xl"></i>
                        </div>
                        <span className="font-medium text-sm">View Orders</span>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <div className="card p-4">
                        <p className="text-sm text-gray-500">Products</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.total_products || 0}</p>
                    </div>
                    <div className="card p-4">
                        <p className="text-sm text-gray-500">Customers</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.total_customers || 0}</p>
                    </div>
                    <div className="card p-4">
                        <p className="text-sm text-gray-500">Orders Today</p>
                        <p className="text-2xl font-bold text-primary-600">{stats?.orders_today || 0}</p>
                    </div>
                    <div className="card p-4">
                        <p className="text-sm text-gray-500">Revenue Today</p>
                        <p className="text-2xl font-bold text-accent-600">
                            KSh {(stats?.revenue_today || 0).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Pending Orders Alert */}
                {stats?.pending_orders > 0 && (
                    <Link to="/admin/orders?status=pending" className="block mb-6">
                        <div className="card p-4 bg-amber-50 border border-amber-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                    <i className="fas fa-clock text-amber-600"></i>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-amber-800">
                                        {stats.pending_orders} Pending Order{stats.pending_orders > 1 ? 's' : ''}
                                    </p>
                                    <p className="text-sm text-amber-600">Tap to review</p>
                                </div>
                                <i className="fas fa-chevron-right text-amber-400"></i>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Low Stock Alert */}
                {lowStock.length > 0 && (
                    <div className="card mb-6">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <i className="fas fa-exclamation-triangle text-red-500"></i>
                                <h3 className="font-semibold text-gray-900">Low Stock Alert</h3>
                            </div>
                            <span className="badge-danger">{lowStock.length}</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {lowStock.slice(0, 3).map((product) => (
                                <Link
                                    key={product.id}
                                    to={`/admin/products/${product.id}`}
                                    className="flex items-center gap-3 p-3 hover:bg-gray-50"
                                >
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        {product.image ? (
                                            <img
                                                src={`http://localhost:8000${product.image}`}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <i className="fas fa-couch text-gray-300"></i>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate">{product.name}</p>
                                        <p className="text-sm text-red-500">Only {product.stock} left</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Orders */}
                <div className="card">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Recent Orders</h3>
                        <Link to="/admin/orders" className="text-sm text-primary-600">View All</Link>
                    </div>
                    {recentOrders.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {recentOrders.map((order) => (
                                <Link
                                    key={order.id}
                                    to={`/admin/orders/${order.id}`}
                                    className="flex items-center justify-between p-4 hover:bg-gray-50"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">{order.customer_name}</p>
                                        <p className="text-sm text-gray-500">{order.order_number}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">
                                            KSh {order.total.toLocaleString()}
                                        </p>
                                        <span className={`badge ${order.status === 'pending' ? 'badge-warning' :
                                                order.status === 'confirmed' ? 'badge-primary' :
                                                    order.status === 'delivered' ? 'badge-success' :
                                                        'badge-danger'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <i className="fas fa-inbox text-3xl mb-2 opacity-50"></i>
                            <p>No orders yet</p>
                        </div>
                    )}
                </div>

                {/* Monthly Stats */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                    <div className="card p-4 text-center">
                        <p className="text-xs text-gray-500 uppercase">This Week</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">{stats?.orders_this_week || 0}</p>
                        <p className="text-xs text-gray-400">orders</p>
                    </div>
                    <div className="card p-4 text-center">
                        <p className="text-xs text-gray-500 uppercase">This Month</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">{stats?.orders_this_month || 0}</p>
                        <p className="text-xs text-gray-400">orders</p>
                    </div>
                    <div className="card p-4 text-center">
                        <p className="text-xs text-gray-500 uppercase">Revenue</p>
                        <p className="text-lg font-bold text-accent-600 mt-1">
                            {((stats?.revenue_this_month || 0) / 1000).toFixed(0)}K
                        </p>
                        <p className="text-xs text-gray-400">KSh this month</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
