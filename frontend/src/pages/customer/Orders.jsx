/**
 * Daniel Furniture - Customer Orders Page
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI, API_HOST } from '../../api';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/layout/Header';
import { LoadingSpinner } from '../../components/ui/Loading';

export default function Orders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ordersAPI.getAll()
            .then((res) => setOrders(res.data.orders || res.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
                <Header title="My Orders" showBack />
                <div className="flex items-center justify-center py-20">
                    <LoadingSpinner size="lg" />
                </div>
            </div>
        );
    }

    // Empty state
    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
                <Header title="My Orders" showBack />
                <div className="max-w-lg mx-auto px-4 py-16 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-box-open text-4xl text-gray-400"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
                    <p className="text-gray-500 mb-8">
                        You haven't placed any orders yet. Start shopping and your orders will appear here.
                    </p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
                    >
                        <i className="fas fa-couch"></i>
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    // Orders list
    return (
        <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
            <Header title="My Orders" showBack />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Order Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-900">Order #{order.id}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(order.created_at).toLocaleDateString('en-KE', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-gray-100 text-gray-700'
                                    }`}>
                                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                </span>
                            </div>

                            {/* Order Items */}
                            <div className="p-4">
                                {order.items?.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 py-2">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.product?.images?.[0] ? (
                                                <img
                                                    src={`${API_HOST}${item.product.images[0]}`}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <i className="fas fa-couch text-gray-300"></i>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">
                                                {item.product?.name || 'Product'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Qty: {item.quantity} × KSh {item.price?.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Total */}
                            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-gray-600">Total</span>
                                <span className="text-lg font-bold text-gray-900">
                                    KSh {order.total?.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
