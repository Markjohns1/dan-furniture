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

            <div className="container-app py-8">
                {/* Status Filters */}
                <div className="flex gap-2 overflow-x-auto pb-4">
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
                            className={`btn-sm whitespace-nowrap ${status === filter.value
                                ? 'btn-primary'
                                : 'btn-secondary'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                <p className="text-sm text-gray-500 mb-4">{pagination.total} orders</p>

                {/* Order List */}
                {orders.length > 0 ? (
                    <div className="space-y-3">
                        {orders.map((order) => (
                            <Link
                                key={order.id}
                                to={`/admin/orders/${order.id}`}
                                className="card p-4 block hover:bg-gray-50"
                            >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div>
                                        <p className="font-semibold text-gray-900">{order.customer_name}</p>
                                        <p className="text-sm text-gray-500">{order.order_number}</p>
                                    </div>
                                    <span className={`badge ${statusColors[order.status]}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </span>
                                    <span className="font-bold text-primary-600">
                                        KSh {order.total.toLocaleString()}
                                    </span>
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
