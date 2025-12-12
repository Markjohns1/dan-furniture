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

            {/* Desktop: Grid layout for efficient space usage. Mobile: Stacked (space-y-5) */}
            <div className="container-app py-6 mt-6">

                {/* 1. Top Stats Row (Revenue, Orders, Products, Customers) */}
                {/* 1. Mobile Stats (Combined Cards to save space) */}
                <div className="grid grid-cols-1 gap-4 mb-6 lg:hidden">
                    {/* Revenue & Orders Group */}
                    <div className="card border border-gray-200 shadow-sm bg-white overflow-hidden rounded-xl">
                        <div className="flex items-center p-4 border-b border-gray-100">
                            <div className="p-2.5 bg-primary-50 rounded-xl shrink-0 mr-4">
                                <i className="fas fa-money-bill-wave text-xl text-primary-600"></i>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Revenue</p>
                                <p className="text-xl font-bold text-gray-900">
                                    <span className="text-sm text-gray-400 font-normal mr-1">KSh</span>
                                    {(stats?.revenue_today || 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center p-4">
                            <div className="p-2.5 bg-blue-50 rounded-xl shrink-0 mr-4">
                                <i className="fas fa-shopping-bag text-xl text-blue-600"></i>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Orders</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {stats?.orders_today || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Products & Customers Group */}
                    <div className="card border border-gray-200 shadow-sm bg-white overflow-hidden rounded-xl">
                        <div className="flex items-center p-4 border-b border-gray-100">
                            <div className="p-2.5 bg-gray-50 rounded-xl shrink-0 mr-4">
                                <i className="fas fa-couch text-xl text-gray-500"></i>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Products</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {stats?.total_products || 0}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center p-4">
                            <div className="p-2.5 bg-gray-50 rounded-xl shrink-0 mr-4">
                                <i className="fas fa-users text-xl text-gray-500"></i>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Customers</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {stats?.total_customers || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Desktop Stats Row (Restored "Icon Left" Layout) */}
                <div className="hidden lg:grid lg:grid-cols-4 gap-4 mb-6">
                    {/* Revenue */}
                    <div className="card p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0 pr-2">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 truncate">Revenue</p>
                                <p className="text-2xl font-bold text-gray-900 tracking-tight">
                                    <span className="text-sm text-gray-400 font-normal mr-1">KSh</span>
                                    {(stats?.revenue_today || 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="p-2.5 bg-primary-50 rounded-xl shrink-0">
                                <i className="fas fa-money-bill-wave text-2xl text-primary-600"></i>
                            </div>
                        </div>
                        <div className="mt-3 text-xs font-medium text-emerald-700 bg-emerald-50 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-100">
                            <i className="fas fa-calendar-day"></i>
                            Today
                        </div>
                    </div>

                    {/* Orders */}
                    <div className="card p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0 pr-2">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 truncate">Orders</p>
                                <p className="text-2xl font-bold text-gray-900 tracking-tight">
                                    {stats?.orders_today || 0}
                                </p>
                            </div>
                            <div className="p-2.5 bg-blue-50 rounded-xl shrink-0">
                                <i className="fas fa-shopping-bag text-2xl text-blue-600"></i>
                            </div>
                        </div>
                        <div className="mt-3 text-xs font-medium text-blue-700 bg-blue-50 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-blue-100">
                            <i className="fas fa-clock"></i>
                            Today
                        </div>
                    </div>

                    {/* Products */}
                    <div className="card p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0 pr-2">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 truncate">Products</p>
                                <p className="text-2xl font-bold text-gray-900 tracking-tight">
                                    {stats?.total_products || 0}
                                </p>
                            </div>
                            <div className="p-2.5 bg-gray-50 rounded-xl shrink-0">
                                <i className="fas fa-couch text-2xl text-gray-400"></i>
                            </div>
                        </div>
                        <div className="mt-3 text-xs font-medium text-gray-500 bg-gray-100 inline-block px-2.5 py-1 rounded-lg border border-gray-200">
                            Total Inventory
                        </div>
                    </div>

                    {/* Customers */}
                    <div className="card p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0 pr-2">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 truncate">Customers</p>
                                <p className="text-2xl font-bold text-gray-900 tracking-tight">
                                    {stats?.total_customers || 0}
                                </p>
                            </div>
                            <div className="p-2.5 bg-gray-50 rounded-xl shrink-0">
                                <i className="fas fa-users text-2xl text-gray-400"></i>
                            </div>
                        </div>
                        <div className="mt-3 text-xs font-medium text-gray-500 bg-gray-100 inline-block px-2.5 py-1 rounded-lg border border-gray-200">
                            Total Registered
                        </div>
                    </div>
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
                                                to={`/admin/orders/${order.id}`}
                                                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${order.status === 'pending' ? 'bg-accent-400 ring-4 ring-accent-50 group-hover:ring-accent-100' :
                                                        order.status === 'confirmed' ? 'bg-blue-400 ring-4 ring-blue-50 group-hover:ring-blue-100' :
                                                            order.status === 'delivered' ? 'bg-green-400 ring-4 ring-green-50 group-hover:ring-green-100' :
                                                                'bg-red-400 ring-4 ring-red-50 group-hover:ring-red-100'
                                                        } transition-all`}></div>
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

                        {/* Pending Orders Widget */}
                        <div className="card p-4 flex items-center justify-between border border-gray-200 shadow-sm bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${stats?.pending_orders > 0 ? 'bg-accent-50 text-accent-700 border-accent-200' : 'bg-white text-gray-400 border-gray-200'}`}>
                                    <i className="fas fa-clock text-sm"></i>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Pending</p>
                                    <p className={`text-xl font-bold leading-none mt-1 ${stats?.pending_orders > 0 ? 'text-accent-700' : 'text-gray-900'}`}>
                                        {stats?.pending_orders || 0}
                                    </p>
                                </div>
                            </div>
                            {stats?.pending_orders > 0 && (
                                <Link to="/admin/orders?status=pending" className="text-xs font-bold text-primary-600 hover:text-primary-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm hover:shadow transition-all">
                                    Review
                                </Link>
                            )}
                        </div>

                        {/* Low Stock Widget */}
                        {lowStock.length > 0 && (
                            <div className="card border border-red-200 bg-red-50/30 shadow-sm overflow-hidden">
                                <div className="p-3.5 border-b border-red-100 flex items-center justify-between bg-red-50/50">
                                    <div className="flex items-center gap-2 text-red-800">
                                        <i className="fas fa-exclamation-triangle text-sm"></i>
                                        <span className="text-xs font-bold uppercase tracking-wide">Low Stock</span>
                                    </div>
                                    <span className="bg-white border border-red-200 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{lowStock.length} items</span>
                                </div>
                                <div className="divide-y divide-red-100/50 bg-white">
                                    {lowStock.slice(0, 3).map((product) => (
                                        <Link
                                            key={product.id}
                                            to={`/admin/products/${product.id}`}
                                            className="flex items-center gap-3 p-3 hover:bg-red-50 transition-colors group"
                                        >
                                            <div className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-200 group-hover:border-red-200 transition-colors">
                                                {product.image ? (
                                                    <img
                                                        src={`http://localhost:8000${product.image}`}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <i className="fas fa-couch text-gray-300 text-xs"></i>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                                                <p className="text-xs text-red-600 font-bold mt-0.5">Qty: {product.stock}</p>
                                            </div>
                                            <i className="fas fa-chevron-right text-red-200 text-xs group-hover:text-red-400 group-hover:translate-x-1 transition-all"></i>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
