/**
 * Daniel Furniture - Cart Drawer
 * Premium side-drawer for better UX
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
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in"
                onClick={onClose}
            ></div>

            {/* Panel */}
            <div className="absolute inset-y-0 right-0 max-w-full flex pb-16 lg:pb-0">
                <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-left">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
                            <p className="text-xs text-secondary-500 font-medium uppercase tracking-wider mt-0.5">
                                {items.length} {items.length === 1 ? 'item' : 'items'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 -mr-2 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    {/* Items List */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="px-6 py-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <i className="fas fa-shopping-bag text-3xl text-gray-200"></i>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Cart is empty</h3>
                                    <p className="text-gray-500 text-sm mt-2 mb-8">Looks like you haven't added <br /> anything to your cart yet.</p>
                                    <Link
                                        to="/products"
                                        onClick={onClose}
                                        className="btn-primary"
                                    >
                                        Start Shopping
                                    </Link>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={`${item.id}-${item.color}`} className="flex gap-4 group">
                                        <div className="w-20 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                                            <img
                                                src={item.image ? `${API_HOST}${item.image}` : '/placeholder-furniture.jpg'}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</h4>
                                                <button
                                                    onClick={() => removeItem(item.id, item.color)}
                                                    className="w-8 h-8 flex items-center justify-center text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                                >
                                                    <i className="fas fa-trash-alt text-sm"></i>
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 capitalize">{item.color}</p>
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center border border-gray-100 rounded-lg overflow-hidden bg-white shadow-sm">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.color)}
                                                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 text-gray-500 border-r border-gray-50"
                                                    >
                                                        <i className="fas fa-minus text-[8px]"></i>
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-bold text-gray-800">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.color)}
                                                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 text-gray-500 border-l border-gray-50"
                                                        disabled={item.quantity >= 100}
                                                    >
                                                        <i className="fas fa-plus text-[8px]"></i>
                                                    </button>
                                                </div>
                                                <span className="text-sm font-bold text-primary-600">
                                                    KSh {item.price.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Spotlight Section - Fills the void */}
                        {items.length > 0 && (
                            <div className="px-6 pb-6 mt-auto">
                                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group">
                                    <img
                                        src={items[0].image ? `${API_HOST}${items[0].image}` : '/placeholder-furniture.jpg'}
                                        alt="Excellent Choice"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-transparent to-transparent flex flex-col justify-end p-6">
                                        <p className="text-accent-400 text-[10px] font-bold uppercase tracking-widest mb-1">Excellent Choice</p>
                                        <h3 className="text-white font-display text-xl leading-tight opacity-90">{items[0].name}</h3>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="px-6 py-6 bg-gray-50 border-t border-gray-100 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 font-medium">Subtotal</span>
                                <span className="text-xl font-bold text-gray-900">KSh {subtotal.toLocaleString()}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-semibold">
                                Free delivery within Nairobi
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    to="/cart"
                                    onClick={onClose}
                                    className="btn-secondary py-3 text-center !shadow-none"
                                >
                                    View Cart
                                </Link>
                                <Link
                                    to="/cart?checkout=true"
                                    onClick={onClose}
                                    className="btn-primary py-3 text-center !shadow-lg"
                                >
                                    Full Checkout
                                </Link>
                            </div>
                            <div className="pt-1">
                                <WhatsAppOrderButton
                                    message={getWhatsAppMessage({ name: 'Lazy Customer', phone: 'Direct Chat', address: 'Drawer Checkout' })}
                                    className="!py-3 !text-sm !bg-white !text-green-600 border border-green-200 shadow-sm"
                                    onComplete={() => {
                                        clearCart();
                                        onClose();
                                    }}
                                />
                                <p className="text-[9px] text-center text-gray-400 mt-2 italic font-medium">Quickest way to order ⚡</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
