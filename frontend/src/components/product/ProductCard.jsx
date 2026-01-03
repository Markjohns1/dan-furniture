/**
 * Dan Classic Furniture - Product Card Component
 * Clean, professional design
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { API_HOST } from '../../api';

export default function ProductCard({ product }) {
    const { addItem, openCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

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
        // Add to cart but don't open drawer immediately, let animation play
        addItem(product, 1, product.colors?.[0] || null);

        setTimeout(() => {
            setIsAdding(false);
            setIsAdded(true);
        }, 800);

        setTimeout(() => {
            setIsAdded(false);
        }, 2000);
    };

    const discount = product.compare_price && product.compare_price > product.price
        ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
        : 0;

    return (
        <Link
            to={`/products/${product.id}`}
            className="group bg-white rounded-2xl overflow-hidden border border-primary-100 hover:border-primary-900 shadow-[0_4px_12px_rgba(15,23,42,0.08)] hover:shadow-[0_12px_32px_rgba(15,23,42,0.15)] transition-all duration-500 flex flex-col h-full"
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <i className="fas fa-couch text-4xl text-gray-200"></i>
                    </div>
                )}

                {/* Badges Overlay */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex flex-col gap-1.5 items-start">
                    {product.featured && (
                        <span className="px-2 py-0.5 bg-primary-950 text-white text-[9px] font-bold uppercase tracking-widest rounded shadow-sm">
                            Exclusive
                        </span>
                    )}
                    {discount > 0 && (
                        <span className="px-2 py-0.5 bg-accent-600 text-white text-[9px] font-bold uppercase tracking-widest rounded shadow-sm">
                            -{discount}% OFF
                        </span>
                    )}
                    {product.stock > 0 && product.stock < 5 && (
                        <span className="px-2 py-0.5 bg-red-600 text-white text-[9px] font-bold uppercase tracking-widest rounded shadow-sm animate-pulse">
                            Low Stock
                        </span>
                    )}
                </div>

                {/* Mobile Add Button - Animated */}
                <button
                    onClick={handleMobileAdd}
                    disabled={product.stock === 0}
                    className={`lg:hidden absolute bottom-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg transition-all duration-300 transform active:scale-95 ${isAdded
                        ? 'bg-green-600 text-white border-green-600'
                        : isAdding
                            ? 'bg-primary-700 text-white border-primary-700 pr-4'
                            : 'bg-primary-950 text-white border-primary-950 hover:bg-primary-900'
                        }`}
                >
                    {isAdded ? (
                        <>
                            <i className="fas fa-check text-[10px]"></i>
                            <span className="text-[10px] font-bold uppercase tracking-wide">Added</span>
                        </>
                    ) : isAdding ? (
                        <>
                            <i className="fas fa-circle-notch fa-spin text-[10px]"></i>
                            <span className="text-[10px] font-bold uppercase tracking-wide">Adding...</span>
                        </>
                    ) : (
                        <>
                            <i className="fas fa-plus text-[10px]"></i>
                            <span className="text-[10px] font-bold uppercase tracking-wide">
                                {product.stock === 0 ? 'Out' : 'ADD TO CART'}
                            </span>
                        </>
                    )}
                </button>

                {/* Quick Add Overlay (Desktop) */}
                <div className="hidden lg:block absolute inset-x-3 bottom-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10">
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="w-full py-2.5 bg-white/95 backdrop-blur-md text-primary-950 text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-xl hover:bg-primary-950 hover:text-white transition-all active:scale-95"
                    >
                        {product.stock === 0 ? 'Sold Out' : 'Quick Add'}
                    </button>
                </div>
            </div>

            {/* Product Content */}
            <div className="p-3 flex flex-col flex-1">
                {/* Category & Rating Row */}
                <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-[0.1em]">
                        {product.category?.name || 'Collection'}
                    </p>
                    <div className="flex text-accent-500 text-[8px]">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                    </div>
                </div>

                {/* Name */}
                <h3 className="font-semibold text-primary-900 text-sm leading-snug group-hover:text-primary-600 transition-colors line-clamp-2 mb-1">
                    {product.name}
                </h3>

                <div className="flex items-end justify-between mt-3">
                    {/* Price Block */}
                    <div className="flex flex-col">
                        {product.compare_price && product.compare_price > product.price && (
                            <p className="text-[10px] text-secondary-400 line-through font-medium mb-0.5">
                                KSh {product.compare_price.toLocaleString()}
                            </p>
                        )}
                        <p className="text-[16px] font-bold text-primary-950 uppercase tracking-tight">
                            KSh {product.price.toLocaleString()}
                        </p>
                    </div>

                    {/* Highly Intuitive Color Options */}
                    {product.colors?.length > 0 && (
                        <div className="flex flex-col items-end gap-1.5">
                            <span className="text-[8px] font-black text-primary-400 uppercase tracking-widest leading-none">
                                {product.colors.length > 1 ? `${product.colors.length} Colors` : 'Color'}
                            </span>
                            <div className="flex -space-x-2">
                                {product.colors.slice(0, 3).map((color, i) => (
                                    <div
                                        key={i}
                                        className="w-4.5 h-4.5 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200 transition-all hover:-translate-y-1 hover:scale-110 z-0 hover:z-10"
                                        style={{ backgroundColor: color.toLowerCase() }}
                                        title={color}
                                    ></div>
                                ))}
                                {product.colors.length > 3 && (
                                    <div className="w-4.5 h-4.5 rounded-full bg-gray-50 border-2 border-white shadow-sm ring-1 ring-gray-100 flex items-center justify-center z-20">
                                        <span className="text-[8px] font-bold text-gray-500">+{product.colors.length - 3}</span>
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
