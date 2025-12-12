/**
 * Dan Classic Furniture - Admin Order Management
 */
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ordersAPI } from '../../api';
import Header from '../../components/layout/Header';
import { LoadingSpinner } from '../../components/ui/Loading';

const statusColors = {
    pending: 'badge-warning',
    confirmed: 'badge-primary',
    processing: 'badge-gray',
    delivered: 'badge-success',
    cancelled: 'badge-danger',
};

export default function OrderManagement() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;

    useEffect(() => {
        setLoading(true);
        ordersAPI.getAll({ status, page, limit: 20 })
            .then((res) => {
                setOrders(res.data.orders);
                setPagination({
                    page: res.data.page,
                    pages: res.data.pages,
                    total: res.data.total,
                });
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [status, page]);

    const handleStatusFilter = (newStatus) => {
        const params = new URLSearchParams();
        if (newStatus) params.set('status', newStatus);
        setSearchParams(params);
    };

    if (loading) {
        return (
            <div className="page pb-safe-nav">
                <Header title="Orders" />
                <div className="flex items-center justify-center py-20">
                    <LoadingSpinner size="lg" />
                </div>
            </div>
        );
    }

    return (
        <div className="page pb-safe-nav">
            <Header title="Orders" />

            <div className="container-app py-6 mt-6">
                {/* Status Filters */}
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                    {[
                        { value: null, label: 'All' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'confirmed', label: 'Confirmed' },
                        { value: 'delivered', label: 'Delivered' },
                        { value: 'cancelled', label: 'Cancelled' },
                    ].map((filter) => (
                        <button
                            key={filter.value || 'all'}
                            onClick={() => handleStatusFilter(filter.value)}
                            className={`btn-sm whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors border ${status === filter.value
                                ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center justify-between mb-4 px-1">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">{pagination.total} orders found</p>
                </div>

                {/* Order List */}
                {orders.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {orders.map((order) => (
                            <Link
                                key={order.id}
                                to={`/admin/orders/${order.id}`}
                                className="card p-5 block hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm group bg-white"
                            >
                                <div className="flex items-start justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${order.status === 'pending' ? 'bg-accent-50 text-accent-700 border-accent-200' :
                                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                order.status === 'delivered' ? 'bg-green-100 text-green-700 border-green-200' :
                                                    'bg-red-100 text-red-700 border-red-200'
                                            }`}>
                                            <i className={`fas text-lg ${order.status === 'pending' ? 'fa-clock' :
                                                order.status === 'confirmed' ? 'fa-box' :
                                                    order.status === 'delivered' ? 'fa-check' :
                                                        'fa-times'
                                                }`}></i>
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-gray-900 line-clamp-1">{order.customer_name}</p>
                                            <p className="text-xs text-gray-500 font-mono mt-0.5">{order.order_number}</p>
                                        </div>
                                    </div>
                                    <span className={`badge ${statusColors[order.status]}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                    <p className="text-sm text-gray-500 font-medium">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-base font-bold text-gray-900">
                                            <span className="text-xs text-gray-400 font-normal mr-1">KSh</span>
                                            {order.total.toLocaleString()}
                                        </p>
                                        <i className="fas fa-chevron-right text-gray-300 text-sm group-hover:text-primary-500 transition-colors"></i>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <i className="fas fa-inbox text-5xl text-gray-300 mb-4"></i>
                        <p className="text-gray-500">No orders found</p>
                    </div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                        <button
                            onClick={() => {
                                const params = new URLSearchParams(searchParams);
                                params.set('page', String(page - 1));
                                setSearchParams(params);
                            }}
                            disabled={page <= 1}
                            className="btn-outline btn-sm"
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <span className="btn-secondary btn-sm">
                            {page} / {pagination.pages}
                        </span>
                        <button
                            onClick={() => {
                                const params = new URLSearchParams(searchParams);
                                params.set('page', String(page + 1));
                                setSearchParams(params);
                            }}
                            disabled={page >= pagination.pages}
                            className="btn-outline btn-sm"
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
