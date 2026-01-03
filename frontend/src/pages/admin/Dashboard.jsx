/**
 * Daniel Furniture - Admin Dashboard
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, API_HOST } from '../../api';
import Header from '../../components/layout/Header';
import { LoadingSpinner } from '../../components/ui/Loading';
import AdminNav from '../../components/admin/AdminNav';

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

            {/* Admin Quick Nav */}
            <AdminNav />

            {/* Desktop: Grid layout for efficient space usage. Mobile: Stacked (space-y-5) */}
            <div className="container-app py-6">

                {/* 1. Top Stats Row (Revenue, Orders, Products, Customers) */}
                {/* 1. Mobile Stats (Combined Cards to save space) */}
                {/* 1. Smart Action Center (Dynamic Tasks) */}
                {(stats?.pending_orders > 0 || stats?.low_stock_count > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-fade-in-up">
                        {stats?.pending_orders > 0 && (
                            <Link to="/admin/orders?status=pending" className="flex items-center justify-between p-4 bg-accent-600 rounded-xl shadow-lg shadow-accent-600/20 group hover:scale-[1.02] transition-transform">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
                                        <i className="fas fa-clock animate-pulse"></i>
                                    </div>
                                    <div className="text-white">
                                        <p className="font-bold text-lg leading-tight">{stats.pending_orders} Pending Orders</p>
                                        <p className="text-xs text-accent-100 font-medium">Requires immediate processing</p>
                                    </div>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-white text-accent-600 flex items-center justify-center group-hover:bg-accent-50 transition-colors">
                                    <i className="fas fa-arrow-right text-sm"></i>
                                </div>
                            </Link>
                        )}
                        {stats?.low_stock_count > 0 && (
                            <Link to="/admin/analytics/low-stock" className="flex items-center justify-between p-4 bg-red-600 rounded-xl shadow-lg shadow-red-600/20 group hover:scale-[1.02] transition-transform">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
                                        <i className="fas fa-exclamation-triangle"></i>
                                    </div>
                                    <div className="text-white">
                                        <p className="font-bold text-lg leading-tight">{stats.low_stock_count} Low Stock Items</p>
                                        <p className="text-xs text-red-100 font-medium">Restock needed soon</p>
                                    </div>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-white text-red-600 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                                    <i className="fas fa-arrow-right text-sm"></i>
                                </div>
                            </Link>
                        )}
                    </div>
                )}

                {/* 2. Key Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
                    {/* Revenue */}
                    <div className="card p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between h-full bg-white">
                        <div className="flex flex-col gap-1 mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Revenue</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-medium text-gray-400">KSh</span>
                                <span className="text-2xl md:text-3xl font-black text-primary-900 tracking-tight">{(stats?.revenue_today || 0).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-50">
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">+12% vs yest.</span>
                            <span className="text-[10px] text-gray-400 ml-auto">Today</span>
                        </div>
                    </div>

                    {/* Orders */}
                    <Link to="/admin/orders" className="card p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group bg-white">
                        <div className="flex flex-col gap-1 mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors">Orders</span>
                            <span className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">{stats?.orders_today || 0}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 pt-3 border-t border-gray-50">
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">New</span>
                            <i className="fas fa-chevron-right ml-auto text-xs text-gray-300 group-hover:text-blue-500 transition-colors"></i>
                        </div>
                    </Link>

                    {/* Inventory */}
                    <Link to="/admin/products" className="card p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group bg-white">
                        <div className="flex flex-col gap-1 mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-primary-600 transition-colors">Products</span>
                            <span className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight group-hover:text-primary-600 transition-colors">{stats?.total_products || 0}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 pt-3 border-t border-gray-50">
                            <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">Active</span>
                            <i className="fas fa-chevron-right ml-auto text-xs text-gray-300 group-hover:text-primary-500 transition-colors"></i>
                        </div>
                    </Link>

                    {/* Customers */}
                    <Link to="/admin/customers" className="card p-4 md:p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group bg-white">
                        <div className="flex flex-col gap-1 mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-purple-600 transition-colors">Customers</span>
                            <span className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight group-hover:text-purple-600 transition-colors">{stats?.total_customers || 0}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 pt-3 border-t border-gray-50">
                            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">Total</span>
                            <i className="fas fa-chevron-right ml-auto text-xs text-gray-300 group-hover:text-purple-500 transition-colors"></i>
                        </div>
                    </Link>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                    {/* LEFT COLUMN: Performance & Recent Activity */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Performance */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3 px-1">Performance</h3>
                            <div className="card divide-y divide-gray-100 border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-green-100 shrink-0 shadow-sm">
                                            <i className="fas fa-chart-line text-sm"></i>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Revenue</span>
                                            <span className="text-xs text-gray-400 font-medium">This Month</span>
                                        </div>
                                    </div>
                                    <span className="font-bold text-gray-900 text-lg whitespace-nowrap">KSh {((stats?.revenue_this_month || 0) / 1000).toFixed(1)}K</span>
                                </div>
                                <div className="p-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0 shadow-sm">
                                            <i className="fas fa-shopping-cart text-sm"></i>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Orders</span>
                                            <span className="text-xs text-gray-400 font-medium">This Month</span>
                                        </div>
                                    </div>
                                    <span className="font-bold text-gray-900 text-lg">{stats?.orders_this_month || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div>
                            <div className="flex items-center justify-between mb-3 px-1">
                                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                                <Link to="/admin/orders" className="btn btn-sm btn-secondary bg-white shadow-sm border border-gray-200">View All</Link>
                            </div>

                            <div className="card border border-gray-200 overflow-hidden shadow-sm">
                                {recentOrders.length > 0 ? (
                                    <div className="divide-y divide-gray-100">
                                        {recentOrders.map((order) => (
                                            <Link
                                                key={order.id}
                                                to={`/ admin / orders / ${order.id} `}
                                                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w - 2.5 h - 2.5 rounded - full shrink - 0 ${order.status === 'pending' ? 'bg-accent-400 ring-4 ring-accent-50 group-hover:ring-accent-100' :
                                                        order.status === 'confirmed' ? 'bg-blue-400 ring-4 ring-blue-50 group-hover:ring-blue-100' :
                                                            order.status === 'delivered' ? 'bg-green-400 ring-4 ring-green-50 group-hover:ring-green-100' :
                                                                'bg-red-400 ring-4 ring-red-50 group-hover:ring-red-100'
                                                        } transition - all`}></div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-gray-900 truncate">{order.customer_name}</p>
                                                        <p className="text-xs text-gray-500 font-medium mt-0.5">{order.order_number}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="text-sm font-bold text-gray-900">
                                                        <span className="text-xs text-gray-400 font-normal mr-1">KSh</span>
                                                        {order.total.toLocaleString()}
                                                    </p>
                                                    <p className="text-xs text-gray-500 capitalize font-medium mt-0.5">{order.status}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-10 text-center text-gray-500">
                                        <p className="text-sm">No recent orders found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Actions & Widgets */}
                    <div className="space-y-6">

                        {/* Quick Actions */}
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-3 px-1">Actions</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                                <Link to="/admin/products/new" className="card p-4 flex items-center gap-4 hover:bg-primary-50/10 hover:border-primary-100 transition-all border border-gray-200 shadow-sm group">
                                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 border border-primary-100 group-hover:scale-110 transition-transform">
                                        <i className="fas fa-plus text-sm"></i>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 text-sm">Add Product</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Create listing</p>
                                    </div>
                                    <i className="fas fa-chevron-right text-gray-300 text-xs group-hover:text-primary-500 group-hover:translate-x-1 transition-all"></i>
                                </Link>

                                <Link to="/admin/categories" className="card p-4 flex items-center gap-4 hover:bg-accent-50/10 hover:border-accent-100 transition-all border border-gray-200 shadow-sm group">
                                    <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center text-accent-700 border border-accent-100 group-hover:scale-110 transition-transform">
                                        <i className="fas fa-tags text-sm"></i>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 text-sm">Manage Categories</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Organize items</p>
                                    </div>
                                    <i className="fas fa-chevron-right text-gray-300 text-xs group-hover:text-accent-700 group-hover:translate-x-1 transition-all"></i>
                                </Link>

                                <Link to="/admin/orders" className="card p-4 flex items-center gap-4 hover:bg-blue-50/10 hover:border-blue-100 transition-all border border-gray-200 shadow-sm group">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 group-hover:scale-110 transition-transform">
                                        <i className="fas fa-box text-sm"></i>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 text-sm">Manage Orders</p>
                                        <p className="text-xs text-gray-500 mt-0.5">View status</p>
                                    </div>
                                    <i className="fas fa-chevron-right text-gray-300 text-xs group-hover:text-blue-500 group-hover:translate-x-1 transition-all"></i>
                                </Link>

                                <Link to="/admin/users" className="card p-4 flex items-center gap-4 hover:bg-purple-50/10 hover:border-purple-100 transition-all border border-gray-200 shadow-sm group">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100 group-hover:scale-110 transition-transform">
                                        <i className="fas fa-users text-sm"></i>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 text-sm">Manage Users</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Add admins</p>
                                    </div>
                                    <i className="fas fa-chevron-right text-gray-300 text-xs group-hover:text-purple-500 group-hover:translate-x-1 transition-all"></i>
                                </Link>
                            </div>
                        </div>

                        {/* Widgets removed (Moved to Smart Action Center) */}
                    </div >
                </div >
            </div >
        </div >
    );
}
