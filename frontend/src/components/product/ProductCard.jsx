/**
 * Dan Classic Furniture - Product Card Component
 * Clean, professional design
 */
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
    const { addItem } = useCart();

    const imageUrl = product.images?.[0]
        ? `http://localhost:8000${product.images[0]}`
        : 'https://via.placeholder.com/400x400?text=No+Image';

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, 1, product.colors?.[0] || null);
    };

    const discount = product.compare_price && product.compare_price > product.price
        ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
        : 0;

    return (
        <Link
            to={`/products/${product.id}`}
            className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                />

                {/* Badges - Floating consistently */}
                <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                    {/* Left: Featured */}
                    <div>
                        {product.featured && (
                            <span className="px-1.5 py-0.5 bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm border border-gray-100">
                                Featured
                            </span>
                        )}
                    </div>

                    {/* Right: Discount */}
                    <div>
                        {discount > 0 && (
                            <span className="px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm">
                                -{discount}%
                            </span>
                        )}
                    </div>
                </div>

                {/* Quick Add Overlay - Slides up on hover */}
                <div className="absolute inset-x-3 bottom-2 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="w-full py-1.5 px-3 bg-gray-900 hover:bg-gray-800 text-white text-[11px] font-semibold uppercase tracking-wide rounded-md shadow-md transition-all duration-200 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-3 flex flex-col flex-1 gap-2">
                <div>
                    {/* Category */}
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                        {product.category?.name || 'Furniture'}
                    </p>

                    {/* Name - Tighter spacing, dynamic height */}
                    <h3 className="font-medium text-gray-900 text-sm leading-snug group-hover:text-primary-600 transition-colors">
                        {product.name}
                    </h3>
                </div>

                {/* Price Block - Immediate follow (No large gap) */}
                <div className="flex flex-col items-start gap-0.5 mt-auto sm:mt-0">
                    {product.compare_price && product.compare_price > product.price && (
                        <span className="text-xs text-gray-400 line-through font-medium">
                            KSh {product.compare_price.toLocaleString()}
                        </span>
                    )}
                    <span className="text-base font-bold text-gray-900">
                        KSh {product.price.toLocaleString()}
                    </span>
                </div>
            </div>
        </Link>
    );
}
