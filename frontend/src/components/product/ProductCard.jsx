/**
 * Dan Classic Furniture - Product Card Component
 * Premium, professional design with micro-interactions
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { API_HOST } from '../../api';

export default function ProductCard({ product }) {
    const { addItem, openCart, getQuickWhatsAppMessage } = useCart();
    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const imageUrl = product.images?.length
        ? `${API_HOST}${product.images[0]}`
        : null;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, 1, product.colors?.[0] || null);
        openCart();
    };

    const handleMobileAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isAdding || isAdded) return;

        setIsAdding(true);
        addItem(product, 1, product.colors?.[0] || null);

        setTimeout(() => {
            setIsAdding(false);
            setIsAdded(true);
        }, 600);

        setTimeout(() => {
            setIsAdded(false);
        }, 2500);
    };

    const discount = product.compare_price && product.compare_price > product.price
        ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
        : 0;

    return (
        <Link
            to={`/products/${product.id}`}
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary-200 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] transition-all duration-500 flex flex-col h-full hover-lift"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Loading Skeleton */}
                {!imageLoaded && imageUrl && (
                    <div className="absolute inset-0 skeleton"></div>
                )}

                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <i className="fas fa-couch text-5xl text-gray-200"></i>
                    </div>
                )}

                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Badges Overlay - Enhanced */}
                <div className="absolute top-3 left-3 right-3 flex flex-col gap-2 items-start">
                    {product.featured && (
                        <span className="px-2.5 py-1 bg-primary-950 text-white text-[9px] font-bold uppercase tracking-wider rounded-lg shadow-lg">
                            <i className="fas fa-crown mr-1 text-amber-400"></i>
                            Exclusive
                        </span>
                    )}
                    {discount > 0 && (
                        <span className="px-2.5 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[9px] font-bold uppercase tracking-wider rounded-lg shadow-lg">
                            -{discount}% OFF
                        </span>
                    )}
                    {product.stock > 0 && product.stock < 5 && (
                        <span className="px-2.5 py-1 bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wider rounded-lg shadow-lg animate-pulse-soft">
                            <i className="fas fa-fire mr-1"></i>
                            Only {product.stock} left
                        </span>
                    )}
                    {product.stock === 0 && (
                        <span className="px-2.5 py-1 bg-gray-800 text-white text-[9px] font-bold uppercase tracking-wider rounded-lg shadow-lg">
                            Sold Out
                        </span>
                    )}
                </div>

                {/* Mobile Action Buttons - Always Visible */}
                <div className="lg:hidden absolute bottom-3 left-3 right-3 flex gap-2 z-20">
                    <button
                        onClick={handleMobileAdd}
                        disabled={product.stock === 0}
                        className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-xl shadow-xl transition-all duration-300 transform active:scale-95 font-bold text-[11px] uppercase tracking-wide ${isAdded
                            ? 'bg-green-500 text-white'
                            : isAdding
                                ? 'bg-primary-800 text-white'
                                : product.stock === 0
                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                    : 'bg-primary-950/95 backdrop-blur-md text-white'
                            }`}
                    >
                        {isAdded ? (
                            <>
                                <i className="fas fa-check"></i>
                                Added
                            </>
                        ) : isAdding ? (
                            <i className="fas fa-circle-notch fa-spin"></i>
                        ) : product.stock === 0 ? (
                            'Sold Out'
                        ) : (
                            <>
                                <i className="fas fa-plus text-[10px]"></i>
                                Add
                            </>
                        )}
                    </button>

                    <a
                        href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '254724426993'}?text=${encodeURIComponent(getQuickWhatsAppMessage(product, 1))}`}
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl shadow-xl bg-gradient-to-r from-green-500 to-green-600 text-white active:scale-95 transition-all font-bold text-[11px] uppercase tracking-wide"
                    >
                        <i className="fab fa-whatsapp text-base"></i>
                        Order
                    </a>
                </div>

                {/* Desktop Quick Add Button */}
                <div className="hidden lg:flex absolute inset-x-4 bottom-4 opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10 gap-2">
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="flex-1 py-3 bg-white text-primary-950 text-[11px] font-bold uppercase tracking-wider rounded-xl shadow-xl hover:bg-primary-950 hover:text-white transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {product.stock === 0 ? 'Sold Out' : 'Quick Add'}
                    </button>
                    <a
                        href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '254724426993'}?text=${encodeURIComponent(getQuickWhatsAppMessage(product, 1))}`}
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noreferrer"
                        className="w-12 h-12 flex items-center justify-center bg-green-500 text-white rounded-xl shadow-xl hover:bg-green-600 transition-all active:scale-95"
                    >
                        <i className="fab fa-whatsapp text-lg"></i>
                    </a>
                </div>
            </div>

            {/* Product Content - Enhanced */}
            <div className="p-4 flex flex-col flex-1">
                {/* Category & Rating Row */}
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-black text-secondary-600 uppercase tracking-[0.15em]">
                        {product.category?.name || 'Collection'}
                    </p>
                    <div className="flex items-center gap-1 text-amber-500 text-[9px]">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                    </div>
                </div>

                {/* Product Name */}
                <h3 className="font-semibold text-primary-900 text-base leading-snug group-hover:text-primary-700 transition-colors line-clamp-2 mb-3">
                    {product.name}
                </h3>

                {/* Price & Colors Row */}
                <div className="flex items-end justify-between mt-auto pt-2 border-t border-gray-50">
                    {/* Price Block */}
                    <div className="flex flex-col">
                        {product.compare_price && product.compare_price > product.price && (
                            <p className="text-[11px] text-secondary-500 line-through font-semibold mb-0.5">
                                KSh {product.compare_price.toLocaleString()}
                            </p>
                        )}
                        <p className="text-lg font-bold text-primary-950 tracking-tight">
                            KSh {product.price.toLocaleString()}
                        </p>
                    </div>

                    {/* Color Options - Premium Display */}
                    {product.colors?.length > 0 && (
                        <div className="flex flex-col items-end gap-1.5">
                            <span className="text-[8px] font-black text-secondary-500 uppercase tracking-widest">
                                {product.colors.length > 1 ? `${product.colors.length} Colors` : 'Color'}
                            </span>
                            <div className="flex -space-x-1.5">
                                {product.colors.slice(0, 4).map((color, i) => (
                                    <div
                                        key={i}
                                        className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200 transition-transform hover:scale-125 hover:-translate-y-1 hover:z-10"
                                        style={{ backgroundColor: color.toLowerCase() }}
                                        title={color}
                                    ></div>
                                ))}
                                {product.colors.length > 4 && (
                                    <div className="w-5 h-5 rounded-full bg-gray-100 border-2 border-white shadow-sm ring-1 ring-gray-200 flex items-center justify-center z-20">
                                        <span className="text-[7px] font-bold text-gray-600">+{product.colors.length - 4}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
