/**
 * Daniel Furniture - Cart Drawer
 * Premium side-drawer for better UX with enhanced design
 */
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { API_HOST } from '../../api';
import { WhatsAppOrderButton } from '../ui/WhatsAppButton';

export default function CartDrawer({ isOpen, onClose }) {
    const { items, removeItem, updateQuantity, subtotal, getWhatsAppMessage, clearCart } = useCart();
    const location = useLocation();

    // Close drawer on route change
    useEffect(() => {
        if (isOpen) onClose();
    }, [location.pathname]);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-fade-in"
                onClick={onClose}
            ></div>

            {/* Panel */}
            <div className="absolute inset-y-0 right-0 max-w-full flex pb-16 lg:pb-0">
                <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-left">
                    {/* Header - Enhanced */}
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-white to-gray-50">
                        <div>
                            <h2 className="text-xl font-display font-bold text-gray-900 flex items-center gap-2">
                                <i className="fas fa-shopping-bag text-primary-600"></i>
                                Your Cart
                            </h2>
                            <p className="text-xs text-secondary-500 font-semibold uppercase tracking-wider mt-1">
                                {items.length} {items.length === 1 ? 'item' : 'items'} • KSh {subtotal.toLocaleString()}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    {/* Items List */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="px-6 py-6 space-y-4">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                                        <i className="fas fa-shopping-bag text-4xl text-gray-300"></i>
                                    </div>
                                    <h3 className="text-xl font-display font-bold text-gray-900 mb-2">Cart is empty</h3>
                                    <p className="text-gray-500 text-sm mb-8 max-w-xs">
                                        Looks like you haven't added anything to your cart yet. Start exploring our collection!
                                    </p>
                                    <Link
                                        to="/products"
                                        onClick={onClose}
                                        className="btn-primary px-8"
                                    >
                                        <i className="fas fa-th-large mr-2"></i>
                                        Start Shopping
                                    </Link>
                                </div>
                            ) : (
                                items.map((item, index) => (
                                    <div
                                        key={`${item.id}-${item.color}`}
                                        className="flex gap-4 group p-3 bg-gray-50 hover:bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <div className="w-20 h-24 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
                                            <img
                                                src={item.image ? `${API_HOST}${item.image}` : '/placeholder-furniture.jpg'}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">{item.name}</h4>
                                                <button
                                                    onClick={() => removeItem(item.id, item.color)}
                                                    className="w-7 h-7 flex-shrink-0 flex items-center justify-center text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                                >
                                                    <i className="fas fa-trash-alt text-xs"></i>
                                                </button>
                                            </div>
                                            {item.color && (
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <div
                                                        className="w-3.5 h-3.5 rounded-full border border-gray-200"
                                                        style={{ backgroundColor: item.color.toLowerCase() }}
                                                    ></div>
                                                    <span className="text-xs text-gray-500 capitalize font-medium">{item.color}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.color)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <i className="fas fa-minus text-[9px]"></i>
                                                    </button>
                                                    <span className="w-10 text-center text-sm font-bold text-gray-800">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.color)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                                                        disabled={item.quantity >= 100}
                                                    >
                                                        <i className="fas fa-plus text-[9px]"></i>
                                                    </button>
                                                </div>
                                                <span className="text-base font-bold text-primary-700">
                                                    KSh {(item.price * item.quantity).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Spotlight Section */}
                        {items.length > 0 && (
                            <div className="px-6 pb-6">
                                <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden bg-gradient-to-br from-primary-950 to-primary-900 border border-primary-800 shadow-lg group">
                                    <img
                                        src={items[0].image ? `${API_HOST}${items[0].image}` : '/placeholder-furniture.jpg'}
                                        alt="Excellent Choice"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/60 to-transparent flex flex-col justify-end p-6">
                                        <span className="inline-flex items-center gap-2 text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                                            <i className="fas fa-crown"></i>
                                            Excellent Choice
                                        </span>
                                        <h3 className="text-white font-display text-xl leading-tight">{items[0].name}</h3>
                                        <p className="text-white/70 text-sm mt-1">Premium quality furniture</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer - Enhanced */}
                    {items.length > 0 && (
                        <div className="px-6 py-6 bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-100 space-y-4">
                            {/* Order Summary */}
                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-500 font-medium text-sm">Subtotal</span>
                                    <span className="text-lg font-bold text-gray-900">KSh {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-green-600 text-xs font-semibold">
                                    <i className="fas fa-truck"></i>
                                    Free delivery within Nairobi
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    to="/cart"
                                    onClick={onClose}
                                    className="btn-secondary py-3.5 text-center text-sm font-bold"
                                >
                                    View Cart
                                </Link>
                                <Link
                                    to="/cart?checkout=true"
                                    onClick={onClose}
                                    className="btn-primary py-3.5 text-center text-sm font-bold shadow-lg"
                                >
                                    Checkout
                                </Link>
                            </div>

                            {/* WhatsApp Quick Order */}
                            <div className="pt-2">
                                <WhatsAppOrderButton
                                    message={getWhatsAppMessage({ name: 'Customer', phone: 'Direct Chat', address: 'Via WhatsApp' })}
                                    className="!py-3.5 !text-sm !font-bold !bg-gradient-to-r !from-green-500 !to-green-600 hover:!from-green-600 hover:!to-green-700 shadow-lg shadow-green-500/20"
                                    onComplete={() => {
                                        clearCart();
                                        onClose();
                                    }}
                                />
                                <div className="flex items-center justify-center gap-2 mt-3 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                                    <i className="fas fa-bolt text-amber-500"></i>
                                    Quickest way to order
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
