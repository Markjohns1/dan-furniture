/**
 * Dan Classic Furniture - Product Card Component
 */
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
    const { addItem } = useCart();

    const imageUrl = product.images?.[0]
        ? `http://localhost:8000${product.images[0]}`
        : '/placeholder-furniture.jpg';

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, 1, product.colors?.[0] || null);
    };

    return (
        <Link to={`/products/${product.id}`} className="card-hover group">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.featured && (
                        <span className="badge-primary text-[10px]">
                            <i className="fas fa-star mr-1"></i>
                            Featured
                        </span>
                    )}
                    {product.compare_price && product.compare_price > product.price && (
                        <span className="badge-danger text-[10px]">
                            -{Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
                        </span>
                    )}
                </div>

                {/* Quick Add Button */}
                <button
                    onClick={handleAddToCart}
                    className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary-600 hover:text-white"
                    aria-label="Add to cart"
                >
                    <i className="fas fa-plus"></i>
                </button>

                {/* Out of Stock Overlay */}
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="px-3 py-1.5 bg-white text-gray-900 text-sm font-semibold rounded-full">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-3">
                {/* Category */}
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">
                    {product.category?.name || 'Furniture'}
                </p>

                {/* Name */}
                <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm mb-2">
                    {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary-600">
                        KSh {product.price.toLocaleString()}
                    </span>
                    {product.compare_price && product.compare_price > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                            KSh {product.compare_price.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Colors Preview */}
                {product.colors && product.colors.length > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                        {product.colors.slice(0, 4).map((color, index) => (
                            <span
                                key={index}
                                className="w-4 h-4 rounded-full border border-gray-200"
                                style={{ backgroundColor: color.toLowerCase() }}
                                title={color}
                            />
                        ))}
                        {product.colors.length > 4 && (
                            <span className="text-xs text-gray-500">
                                +{product.colors.length - 4}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
}
