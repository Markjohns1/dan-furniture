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

            <div className="container-app py-8 space-y-6">
                {/* 1. Overview Section (Revenue & Orders) */}
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-3 px-1">Overview</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {/* Revenue - Clean White Theme */}
                        <div className="card p-4 border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <i className="fas fa-money-bill-wave text-4xl text-primary-600"></i>
                            </div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Revenue</p>
                            <p className="text-xl font-bold text-gray-900 tracking-tight">
                                <span className="text-xs text-gray-500 font-normal mr-1">KSh</span>
                                {(stats?.revenue_today || 0).toLocaleString()}
                            </p>
                            <div className="mt-2 text-[10px] font-medium text-emerald-600 bg-emerald-50 inline-block px-1.5 py-0.5 rounded">
                                <i className="fas fa-calendar-day mr-1"></i>
                                Today
                            </div>
                        </div>

                        {/* Orders - Clean White Theme */}
                        <div className="card p-4 border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <i className="fas fa-shopping-bag text-4xl text-blue-600"></i>
                            </div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Orders</p>
                            <p className="text-xl font-bold text-gray-900 tracking-tight">
                                {stats?.orders_today || 0}
                            </p>
                            <div className="mt-2 text-[10px] font-medium text-blue-600 bg-blue-50 inline-block px-1.5 py-0.5 rounded">
                                <i className="fas fa-clock mr-1"></i>
                                Today
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Quick Actions (Horizontal List to save space) */}
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-3 px-1">Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Link to="/admin/products/new" className="card p-3 flex items-center gap-4 hover:bg-gray-50 transition-colors border border-gray-100 shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                                <i className="fas fa-plus text-sm"></i>
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900 text-sm">Add Product</p>
                                <p className="text-xs text-gray-500">Create listing</p>
                            </div>
                            <i className="fas fa-chevron-right text-gray-300 text-xs"></i>
                        </Link>

                        <Link to="/admin/orders" className="card p-3 flex items-center gap-4 hover:bg-gray-50 transition-colors border border-gray-100 shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <i className="fas fa-box text-sm"></i>
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900 text-sm">Manage Orders</p>
                                <p className="text-xs text-gray-500">View status</p>
                            </div>
                            <i className="fas fa-chevron-right text-gray-300 text-xs"></i>
                        </Link>
                    </div>
                </div>

                {/* 3. Key Metrics (2-column grid to prevent text clipping) */}
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-3 px-1">Store Status</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {/* Products */}
                        <div className="card p-3 flex items-center gap-3 border border-gray-100 shadow-sm">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                                <i className="fas fa-couch text-xs"></i>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Products</p>
                                <p className="text-lg font-bold text-gray-900 leading-none">{stats?.total_products || 0}</p>
                            </div>
                        </div>

                        {/* Customers */}
                        <div className="card p-3 flex items-center gap-3 border border-gray-100 shadow-sm">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                                <i className="fas fa-users text-xs"></i>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Customers</p>
                                <p className="text-lg font-bold text-gray-900 leading-none">{stats?.total_customers || 0}</p>
                            </div>
                        </div>

                        {/* Pending - Full width if odd number, or distinct style */}
                        <div className="col-span-2 card p-3 flex items-center justify-between border border-gray-100 shadow-sm bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stats?.pending_orders > 0 ? 'bg-amber-100 text-amber-600' : 'bg-gray-200 text-gray-400'}`}>
                                    <i className="fas fa-clock text-xs"></i>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Pending Orders</p>
                                    <p className={`text-lg font-bold leading-none ${stats?.pending_orders > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
                                        {stats?.pending_orders || 0}
                                    </p>
                                </div>
                            </div>
                            {stats?.pending_orders > 0 && (
                                <Link to="/admin/orders?status=pending" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
                                    Review <i className="fas fa-arrow-right ml-1"></i>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Performance Section */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 px-1">Performance</h3>
                    <div className="card divide-y divide-gray-100 border border-gray-100 shadow-sm">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                    <i className="fas fa-chart-line text-sm"></i>
                                </div>
                                <span className="text-sm font-medium text-gray-700">Total Revenue (This Month)</span>
                            </div>
                            <span className="font-bold text-gray-900">KSh {((stats?.revenue_this_month || 0) / 1000).toFixed(1)}K</span>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <i className="fas fa-shopping-cart text-sm"></i>
                                </div>
                                <span className="text-sm font-medium text-gray-700">Total Orders (This Month)</span>
                            </div>
                            <span className="font-bold text-gray-900">{stats?.orders_this_month || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Recent Orders List */}
                <div>
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                        <Link to="/admin/orders" className="text-sm font-medium text-primary-600 hover:text-primary-700">View All</Link>
                    </div>

                    <div className="card border border-gray-100 overflow-hidden shadow-sm">
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
                    <div className="card border border-red-100 bg-red-50/30 shadow-sm">
                        <div className="p-3 border-b border-red-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-red-700">
                                <i className="fas fa-exclamation-triangle text-sm"></i>
                                <span className="text-sm font-semibold">Low Stock</span>
                            </div>
                            <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{lowStock.length} items</span>
                        </div>
                        <div className="divide-y divide-red-100/50">
                            {lowStock.slice(0, 3).map((product) => (
                                <Link
                                    key={product.id}
                                    to={`/admin/products/${product.id}`}
                                    className="flex items-center gap-3 p-3 hover:bg-red-50 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-white rounded-md overflow-hidden flex-shrink-0 border border-red-100">
                                        {product.image ? (
                                            <img
                                                src={`http://localhost:8000${product.image}`}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                <i className="fas fa-couch text-gray-300 text-[10px]"></i>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                        <p className="text-xs text-red-600 font-medium">Qty: {product.stock}</p>
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
