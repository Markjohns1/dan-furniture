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
                    <div className="flex flex-col gap-1">
                        {product.featured && (
                            <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm border border-gray-100">
                                Featured
                            </span>
                        )}
                        {discount > 0 && (
                            <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm">
                                -{discount}%
                            </span>
                        )}
                    </div>
                </div>

                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center pb-4 bg-gradient-to-t from-black/20 to-transparent">
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="w-full py-2 bg-white text-gray-900 font-semibold text-xs uppercase tracking-wide rounded shadow-md hover:bg-gray-50 border border-gray-100"
                    >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-3 flex flex-col flex-1">
                {/* Category */}
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                    {product.category?.name || 'Furniture'}
                </p>

                {/* Name */}
                <h3 className="font-medium text-gray-900 text-sm leading-snug mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-primary-600 transition-colors">
                    {product.name}
                </h3>

                {/* Spacer */}
                <div className="mt-auto"></div>

                {/* Price Block - Stacked to prevent collision */}
                <div className="flex flex-col items-start gap-0.5">
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
