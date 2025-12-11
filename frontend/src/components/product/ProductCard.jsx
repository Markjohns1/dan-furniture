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
            className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300"
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.featured && (
                        <span className="px-2.5 py-1 bg-primary-600 text-white text-xs font-medium rounded-full shadow-sm">
                            Featured
                        </span>
                    )}
                    {discount > 0 && (
                        <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-medium rounded-full shadow-sm">
                            -{discount}%
                        </span>
                    )}
                </div>

                {/* Quick Add - Appears on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end justify-center opacity-0 group-hover:opacity-100">
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="mb-4 px-4 py-2.5 bg-white text-gray-900 font-medium text-sm rounded-lg shadow-lg hover:bg-gray-100 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <i className="fas fa-plus text-xs"></i>
                        Add to Cart
                    </button>
                </div>

                {/* Out of Stock */}
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <span className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-full">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Category */}
                <p className="text-xs font-medium text-primary-600 uppercase tracking-wide mb-1">
                    {product.category?.name || 'Furniture'}
                </p>

                {/* Name */}
                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
                    {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gray-900">
                        KSh {product.price.toLocaleString()}
                    </span>
                    {product.compare_price && product.compare_price > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                            KSh {product.compare_price.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-3">
                        {product.colors.slice(0, 4).map((color, index) => (
                            <span
                                key={index}
                                className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: color.toLowerCase() }}
                                title={color}
                            />
                        ))}
                        {product.colors.length > 4 && (
                            <span className="text-xs text-gray-500 ml-1">
                                +{product.colors.length - 4}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
}
