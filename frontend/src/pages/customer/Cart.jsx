/**
 * Dan Classic Furniture - Cart Page
 * Professional checkout experience
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/layout/Header';
import { WhatsAppOrderButton } from '../../components/ui/WhatsAppButton';

export default function Cart() {
    const { items, itemCount, subtotal, removeItem, updateQuantity, clearCart, getWhatsAppMessage } = useCart();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [showCheckout, setShowCheckout] = useState(false);
    const [customerInfo, setCustomerInfo] = useState({
        name: user?.full_name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        notes: '',
    });

    const handleQuantityChange = (item, delta) => {
        const newQty = item.quantity + delta;
        if (newQty <= 0) {
            removeItem(item.id, item.color);
        } else {
            updateQuantity(item.id, newQty, item.color);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
                <Header title="Cart" />
                <div className="max-w-lg mx-auto px-4 py-16 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-shopping-cart text-4xl text-gray-400"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Browse our collection and add items to your cart</p>
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

    return (
        <div className="min-h-screen bg-gray-50 pb-40 lg:pb-8">
            <Header title={`Cart (${itemCount})`} showBack />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100">
                                <h2 className="font-semibold text-gray-900">Shopping Cart ({itemCount} items)</h2>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {items.map((item) => (
                                    <div key={`${item.id}-${item.color}`} className="p-4">
                                        <div className="flex gap-4">
                                            {/* Image */}
                                            <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                                                {item.image ? (
                                                    <img
                                                        src={`http://localhost:8000${item.image}`}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <i className="fas fa-couch text-2xl text-gray-300"></i>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                                                {item.color && (
                                                    <p className="text-sm text-gray-500 mt-1">Color: {item.color}</p>
                                                )}
                                                <p className="text-lg font-bold text-primary-600 mt-2">
                                                    KSh {item.price.toLocaleString()}
                                                </p>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                                                        <button
                                                            onClick={() => handleQuantityChange(item, -1)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white transition-colors"
                                                        >
                                                            <i className="fas fa-minus text-xs"></i>
                                                        </button>
                                                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                                        <button
                                                            onClick={() => handleQuantityChange(item, 1)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white transition-colors"
                                                        >
                                                            <i className="fas fa-plus text-xs"></i>
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.id, item.color)}
                                                        className="text-red-500 hover:text-red-600 p-2"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Clear Cart */}
                            <div className="p-4 border-t border-gray-100 flex justify-end">
                                <button
                                    onClick={clearCart}
                                    className="text-sm text-red-500 hover:text-red-600 font-medium"
                                >
                                    <i className="fas fa-trash mr-2"></i>
                                    Clear Cart
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary - Desktop */}
                    <div className="hidden lg:block">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>KSh {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery</span>
                                    <span className="text-green-600">To be confirmed</span>
                                </div>
                                <hr className="border-gray-100" />
                                <div className="flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>KSh {subtotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        navigate('/login?redirect=/cart');
                                    } else {
                                        setShowCheckout(true);
                                    }
                                }}
                                className="w-full py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <i className="fab fa-whatsapp text-xl"></i>
                                Order via WhatsApp
                            </button>

                            <p className="text-center text-xs text-gray-400 mt-3">
                                Secure checkout via WhatsApp
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Checkout Bar */}
            <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600">Total ({itemCount} items)</span>
                    <span className="text-xl font-bold text-gray-900">KSh {subtotal.toLocaleString()}</span>
                </div>
                <button
                    onClick={() => {
                        if (!isAuthenticated) {
                            navigate('/login?redirect=/cart');
                        } else {
                            setShowCheckout(true);
                        }
                    }}
                    className="w-full py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                    <i className="fab fa-whatsapp text-xl"></i>
                    Checkout via WhatsApp
                </button>
            </div>

            {/* Checkout Sheet */}
            {showCheckout && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowCheckout(false)} />
                    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-auto animate-slide-up">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Checkout Details</h3>
                                <button onClick={() => setShowCheckout(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                    <i className="fas fa-times text-gray-500"></i>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        value={customerInfo.name}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                    <input
                                        type="tel"
                                        value={customerInfo.phone}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="0712345678"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                                    <textarea
                                        value={customerInfo.address}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                        placeholder="Enter your delivery address"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                                    <textarea
                                        value={customerInfo.notes}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                                        rows={2}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                        placeholder="Any special requests?"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <div className="flex justify-between text-lg font-bold text-gray-900 mb-4">
                                    <span>Total</span>
                                    <span>KSh {subtotal.toLocaleString()}</span>
                                </div>
                                <WhatsAppOrderButton
                                    message={getWhatsAppMessage(customerInfo)}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
