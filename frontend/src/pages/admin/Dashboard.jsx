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
        <div className="page pb-safe-nav bg-gray-50/50">
            <Header title="Dashboard" />

            <div className="container-app py-6 space-y-6">
                {/* Welcome & Primary Stats */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">Overview</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="card p-5 bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-200">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <i className="fas fa-money-bill-wave text-xl text-white"></i>
                                </div>
                                <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full text-white/90">Today</span>
                            </div>
                            <p className="text-sm text-white/80 font-medium mb-1">Revenue</p>
                            <p className="text-2xl font-bold tracking-tight">
                                KSh {(stats?.revenue_today || 0).toLocaleString()}
                            </p>
                        </div>

                        <div className="card p-5 bg-white shadow-md border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-accent-50 rounded-lg">
                                    <i className="fas fa-shopping-bag text-xl text-accent-600"></i>
                                </div>
                                <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full text-gray-600">Today</span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium mb-1">Orders</p>
                            <p className="text-2xl font-bold text-gray-900 tracking-tight">
                                {stats?.orders_today || 0}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Secondary Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="card p-3 text-center hover:bg-gray-50 transition-colors border border-gray-100">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Products</p>
                        <p className="text-lg font-bold text-gray-900">{stats?.total_products || 0}</p>
                    </div>
                    <div className="card p-3 text-center hover:bg-gray-50 transition-colors border border-gray-100">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Customers</p>
                        <p className="text-lg font-bold text-gray-900">{stats?.total_customers || 0}</p>
                    </div>
                    <div className="card p-3 text-center hover:bg-gray-50 transition-colors border border-gray-100">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Pending</p>
                        <p className={`text-lg font-bold ${stats?.pending_orders > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
                            {stats?.pending_orders || 0}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <Link to="/admin/products/new" className="group relative overflow-hidden card p-0 border border-primary-100">
                        <div className="absolute inset-0 bg-primary-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="p-4 flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                                <i className="fas fa-plus"></i>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Add Product</p>
                                <p className="text-xs text-gray-500">Create new listing</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/admin/orders" className="group relative overflow-hidden card p-0 border border-gray-100">
                        <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="p-4 flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 group-hover:scale-110 transition-transform">
                                <i className="fas fa-list-ul"></i>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Manage Orders</p>
                                <p className="text-xs text-gray-500">View all orders</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Performance Section */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 px-1 flex items-center justify-between">
                        <span>Performance</span>
                        <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">This Month</span>
                    </h3>
                    <div className="card divide-y divide-gray-100 border border-gray-100">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                    <i className="fas fa-chart-line text-sm"></i>
                                </div>
                                <span className="text-sm font-medium text-gray-700">Total Revenue</span>
                            </div>
                            <span className="font-bold text-gray-900">KSh {((stats?.revenue_this_month || 0) / 1000).toFixed(1)}K</span>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <i className="fas fa-shopping-cart text-sm"></i>
                                </div>
                                <span className="text-sm font-medium text-gray-700">Total Orders</span>
                            </div>
                            <span className="font-bold text-gray-900">{stats?.orders_this_month || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Recent Orders List */}
                <div>
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
                        <Link to="/admin/orders" className="text-xs font-medium text-primary-600 hover:text-primary-700">View All</Link>
                    </div>

                    <div className="card border border-gray-100 overflow-hidden">
                        {recentOrders.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {recentOrders.map((order) => (
                                    <Link
                                        key={order.id}
                                        to={`/admin/orders/${order.id}`}
                                        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${order.status === 'pending' ? 'bg-amber-400' :
                                                order.status === 'confirmed' ? 'bg-blue-400' :
                                                    order.status === 'delivered' ? 'bg-green-400' :
                                                        'bg-red-400'
                                                }`}></div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{order.customer_name}</p>
                                                <p className="text-xs text-gray-500">{order.order_number}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">
                                                KSh {order.total.toLocaleString()}
                                            </p>
                                            <p className="text-[10px] text-gray-400 capitalize">{order.status}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <p className="text-sm">No recent orders found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Low Stock Alert */}
                {lowStock.length > 0 && (
                    <div className="card border border-red-100 bg-red-50/50">
                        <div className="p-3 border-b border-red-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-red-700">
                                <i className="fas fa-exclamation-triangle text-sm"></i>
                                <span className="text-sm font-semibold">Low Stock Items</span>
                            </div>
                            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{lowStock.length}</span>
                        </div>
                        <div className="divide-y divide-red-100/50">
                            {lowStock.slice(0, 3).map((product) => (
                                <Link
                                    key={product.id}
                                    to={`/admin/products/${product.id}`}
                                    className="flex items-center gap-3 p-3 hover:bg-red-50 transition-colors"
                                >
                                    <div className="w-10 h-10 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-red-100">
                                        {product.image ? (
                                            <img
                                                src={`http://localhost:8000${product.image}`}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                <i className="fas fa-couch text-gray-300 text-xs"></i>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                        <p className="text-xs text-red-600 font-medium">Only {product.stock} remaining</p>
                                    </div>
                                    <i className="fas fa-chevron-right text-red-300 text-xs"></i>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
