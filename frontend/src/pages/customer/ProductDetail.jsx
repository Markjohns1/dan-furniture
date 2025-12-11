/**
 * Dan Classic Furniture - Product Detail Page
 */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsAPI } from '../../api';
import { useCart } from '../../context/CartContext';
import Header from '../../components/layout/Header';
import { LoadingPage } from '../../components/ui/Loading';
import WhatsAppButton from '../../components/ui/WhatsAppButton';

export default function ProductDetail() {
    const { id } = useParams();
    const { addItem } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        productsAPI.getById(id)
            .then((res) => {
                setProduct(res.data);
                if (res.data.colors?.length > 0) {
                    setSelectedColor(res.data.colors[0]);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    const handleAddToCart = () => {
        addItem(product, quantity, selectedColor);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    if (loading) return <LoadingPage />;
    if (!product) {
        return (
            <div className="page pb-safe-nav">
                <Header showBack />
                <div className="container-app py-12 text-center">
                    <i className="fas fa-exclamation-circle text-5xl text-gray-300 mb-4"></i>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Product not found</h2>
                    <Link to="/products" className="btn-primary mt-4">
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    const images = product.images?.length > 0
        ? product.images.map((img) => `http://localhost:8000${img}`)
        : ['/placeholder-furniture.jpg'];

    return (
        <div className="page pb-32">
            <Header showBack />

            {/* Image Gallery */}
            <div className="relative bg-gray-100">
                <div className="aspect-square">
                    <img
                        src={images[currentImageIndex]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Image Navigation Dots */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                                        ? 'bg-primary-600 w-6'
                                        : 'bg-white/70'
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.featured && (
                        <span className="badge-primary">
                            <i className="fas fa-star mr-1"></i> Featured
                        </span>
                    )}
                    {product.compare_price && product.compare_price > product.price && (
                        <span className="badge-danger">
                            -{Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF
                        </span>
                    )}
                </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
                <div className="container-app py-3">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${index === currentImageIndex ? 'border-primary-600' : 'border-transparent'
                                    }`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Product Info */}
            <div className="container-app py-4">
                {/* Category */}
                <Link
                    to={`/products?category=${product.category?.slug}`}
                    className="text-sm text-primary-600 font-medium"
                >
                    {product.category?.name}
                </Link>

                {/* Name */}
                <h1 className="font-display text-2xl font-bold text-gray-900 mt-1 mb-3">
                    {product.name}
                </h1>

                {/* Price */}
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-primary-600">
                        KSh {product.price.toLocaleString()}
                    </span>
                    {product.compare_price && product.compare_price > product.price && (
                        <span className="text-lg text-gray-400 line-through">
                            KSh {product.compare_price.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2 mb-6">
                    {product.stock > 0 ? (
                        <>
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-sm text-green-600 font-medium">
                                In Stock ({product.stock} available)
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                        </>
                    )}
                </div>

                {/* Colors */}
                {product.colors?.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">
                            Color: <span className="font-normal text-gray-600">{selectedColor}</span>
                        </h3>
                        <div className="flex gap-2">
                            {product.colors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color
                                            ? 'border-primary-600 ring-2 ring-primary-200'
                                            : 'border-gray-200'
                                        }`}
                                    style={{ backgroundColor: color.toLowerCase() }}
                                    title={color}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Quantity */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Quantity</h3>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="btn-outline btn-icon"
                            disabled={quantity <= 1}
                        >
                            <i className="fas fa-minus"></i>
                        </button>
                        <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                        <button
                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                            className="btn-outline btn-icon"
                            disabled={quantity >= product.stock}
                        >
                            <i className="fas fa-plus"></i>
                        </button>
                    </div>
                </div>

                {/* Description */}
                {product.description && (
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                    </div>
                )}

                {/* Details */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Details</h3>
                    <div className="space-y-2 text-sm">
                        {product.material && (
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-500">Material</span>
                                <span className="font-medium text-gray-900">{product.material}</span>
                            </div>
                        )}
                        {product.dimensions && (
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-500">Dimensions</span>
                                <span className="font-medium text-gray-900">{product.dimensions}</span>
                            </div>
                        )}
                        {product.sku && (
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-500">SKU</span>
                                <span className="font-medium text-gray-900">{product.sku}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sticky Add to Cart */}
            <div className="fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-gray-100 p-4 safe-area-pb">
                <div className="container-app max-w-lg mx-auto">
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className={`w-full ${addedToCart ? 'btn-success' : 'btn-primary'} btn-lg`}
                    >
                        {addedToCart ? (
                            <>
                                <i className="fas fa-check"></i>
                                Added to Cart!
                            </>
                        ) : (
                            <>
                                <i className="fas fa-shopping-cart"></i>
                                Add to Cart - KSh {(product.price * quantity).toLocaleString()}
                            </>
                        )}
                    </button>
                </div>
            </div>

            <WhatsAppButton />
        </div>
    );
}
