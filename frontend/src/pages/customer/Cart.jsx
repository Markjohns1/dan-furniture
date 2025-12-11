/**
 * Dan Classic Furniture - Cart Page
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
            <div className="page pb-safe-nav">
                <Header title="Cart" />
                <div className="container-app py-12 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-shopping-cart text-4xl text-gray-400"></i>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">Add some furniture to get started!</p>
                    <Link to="/products" className="btn-primary">
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page pb-48">
            <Header title={`Cart (${itemCount})`} />

            {/* Cart Items */}
            <div className="container-app py-4">
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={`${item.id}-${item.color}`} className="card p-4">
                            <div className="flex gap-4">
                                {/* Image */}
                                <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                    {item.image ? (
                                        <img
                                            src={`http://localhost:8000${item.image}`}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <i className="fas fa-couch text-2xl"></i>
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">
                                        {item.name}
                                    </h3>
                                    {item.color && (
                                        <p className="text-xs text-gray-500 mt-1">Color: {item.color}</p>
                                    )}
                                    <p className="text-primary-600 font-bold mt-1">
                                        KSh {item.price.toLocaleString()}
                                    </p>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleQuantityChange(item, -1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
                                            >
                                                <i className="fas fa-minus text-xs"></i>
                                            </button>
                                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item, 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
                                            >
                                                <i className="fas fa-plus text-xs"></i>
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id, item.color)}
                                            className="text-red-500 hover:text-red-600 text-sm"
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
                <button
                    onClick={clearCart}
                    className="text-sm text-red-500 hover:text-red-600 mt-4"
                >
                    <i className="fas fa-trash mr-1"></i>
                    Clear Cart
                </button>
            </div>

            {/* Checkout Form */}
            {showCheckout && (
                <>
                    <div className="overlay" onClick={() => setShowCheckout(false)} />
                    <div className="bottom-sheet">
                        <div className="bottom-sheet-handle" />
                        <div className="p-4">
                            <h3 className="font-display text-lg font-bold mb-4">Checkout Details</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="label">Your Name *</label>
                                    <input
                                        type="text"
                                        value={customerInfo.name}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                        className="input"
                                        placeholder="Full name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label">Phone Number *</label>
                                    <input
                                        type="tel"
                                        value={customerInfo.phone}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                        className="input"
                                        placeholder="e.g., 0712345678"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label">Delivery Address *</label>
                                    <textarea
                                        value={customerInfo.address}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                                        className="input min-h-[80px]"
                                        placeholder="Where should we deliver?"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label">Notes (Optional)</label>
                                    <textarea
                                        value={customerInfo.notes}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                                        className="input min-h-[60px]"
                                        placeholder="Any special instructions?"
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <WhatsAppOrderButton
                                    message={getWhatsAppMessage(customerInfo)}
                                    className="mb-3"
                                />
                                <button
                                    onClick={() => setShowCheckout(false)}
                                    className="btn-secondary w-full"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Sticky Summary */}
            <div className="fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-gray-100 p-4 safe-area-pb">
                <div className="container-app max-w-lg mx-auto">
                    {/* Summary */}
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                        <span className="text-xl font-bold text-gray-900">
                            KSh {subtotal.toLocaleString()}
                        </span>
                    </div>

                    {/* Checkout Button */}
                    <button
                        onClick={() => {
                            if (!isAuthenticated) {
                                navigate('/login?redirect=/cart');
                            } else {
                                setShowCheckout(true);
                            }
                        }}
                        className="btn-primary w-full btn-lg"
                    >
                        <i className="fab fa-whatsapp text-xl"></i>
                        Proceed to Checkout
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-2">
                        Orders are placed via WhatsApp
                    </p>
                </div>
            </div>
        </div>
    );
}
