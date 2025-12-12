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
import SEO from '../../components/ui/SEO';

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
        <div className="page pb-72 lg:pb-48 bg-white">
            <SEO
                title={product.name}
                description={product.description || `Buy ${product.name} at KSh ${product.price.toLocaleString()}. Quality furniture with doorstep delivery in Kenya.`}
                image={images[0]}
                url={`/products/${product.id}`}
                type="product"
                product={product}
            />
            <Header showBack title={product.name} />

            <div className="container-app py-8 mt-4 mx-auto max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                            <img
                                src={images[currentImageIndex]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />

                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {product.featured && (
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold uppercase tracking-wider rounded-md shadow-sm border border-gray-100">
                                        Featured
                                    </span>
                                )}
                                {product.compare_price && product.compare_price > product.price && (
                                    <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm">
                                        -{Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail Strip */}
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex ? 'border-primary-600 ring-2 ring-primary-100' : 'border-gray-100 hover:border-gray-200'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info - Compact & Structured */}
                    <div className="space-y-6">
                        <div className="border-b border-gray-100 pb-4">
                            <Link
                                to={`/products?category=${product.category?.slug}`}
                                className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 inline-block hover:text-primary-600 transition-colors"
                            >
                                {product.category?.name}
                            </Link>
                            {/* Refined Title Size */}
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-2">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-3">
                                {/* Price in Primary Color */}
                                <span className="text-xl md:text-2xl font-bold text-primary-600">
                                    KSh {product.price.toLocaleString()}
                                </span>
                                {product.compare_price && product.compare_price > product.price && (
                                    <>
                                        <span className="text-sm text-gray-400 line-through font-medium">
                                            KSh {product.compare_price.toLocaleString()}
                                        </span>
                                        <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded border border-green-100">
                                            Save KSh {(product.compare_price - product.price).toLocaleString()}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="prose prose-sm text-gray-600 leading-relaxed text-sm">
                                {product.description}
                            </div>
                        )}

                        {/* Control Panel */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/60 space-y-4">
                            {/* Colors */}
                            {product.colors?.length > 0 && (
                                <div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">
                                        Color: <span className="text-gray-900 font-medium capitalize">{selectedColor}</span>
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {product.colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`w-8 h-8 rounded-full shadow-sm transition-all flex items-center justify-center ${selectedColor === color
                                                    ? 'ring-2 ring-offset-2 ring-gray-900 scale-110'
                                                    : 'hover:scale-105 ring-1 ring-gray-200 hover:ring-gray-300'
                                                    }`}
                                                style={{ backgroundColor: color.toLowerCase() }}
                                                title={color}
                                            >
                                                {selectedColor === color && (
                                                    <i className={`fas fa-check text-[10px] ${['white', 'cream', 'yellow'].includes(color.toLowerCase()) ? 'text-gray-900' : 'text-white'}`}></i>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Quantity</span>
                                <div className="flex items-center gap-0 w-32 bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-9 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors border-r border-gray-100 hover:bg-gray-50"
                                        disabled={quantity <= 1}
                                    >
                                        <i className="fas fa-minus text-[10px]"></i>
                                    </button>
                                    <span className="flex-1 text-center font-semibold text-sm text-gray-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="w-10 h-9 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors border-l border-gray-100 hover:bg-gray-50"
                                        disabled={quantity >= product.stock}
                                    >
                                        <i className="fas fa-plus text-[10px]"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Specifications Grid */}
                        <div className="pt-2 mb-32">
                            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                                {product.material && (
                                    <div className="border border-gray-100 rounded-lg p-3">
                                        <dt className="text-gray-400 text-[10px] uppercase tracking-widest font-semibold mb-1">Material</dt>
                                        <dd className="font-medium text-gray-900">{product.material}</dd>
                                    </div>
                                )}
                                {product.dimensions && (
                                    <div className="border border-gray-100 rounded-lg p-3">
                                        <dt className="text-gray-400 text-[10px] uppercase tracking-widest font-semibold mb-1">Dimensions</dt>
                                        <dd className="font-medium text-gray-900">{product.dimensions}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Add to Cart Bar - Adjusted for Mobile Bottom Nav */}
            <div className="fixed bottom-[60px] lg:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 p-2 safe-area-pb shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
                <div className="container-app max-w-5xl mx-auto flex items-center justify-between gap-4">
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-gray-500">Total Price</p>
                        <p className="text-xl font-bold text-gray-900">KSh {(product.price * quantity).toLocaleString()}</p>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className={`btn-primary flex-1 md:flex-none md:w-64 !py-2.5 ${addedToCart ? '!bg-green-600 hover:!bg-green-700' : ''}`}
                    >
                        {addedToCart ? (
                            <span className="flex items-center justify-center gap-2">
                                <i className="fas fa-check-circle"></i> Added to Cart
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <i className="fas fa-shopping-bag"></i>
                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <WhatsAppButton />
        </div>
    );
}
