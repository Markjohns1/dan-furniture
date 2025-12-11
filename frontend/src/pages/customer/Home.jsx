/**
 * Dan Classic Furniture - Home Page
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../../api';
import Header from '../../components/layout/Header';
import ProductCard from '../../components/product/ProductCard';
import { ProductGridSkeleton } from '../../components/ui/Loading';
import WhatsAppButton from '../../components/ui/WhatsAppButton';

export default function Home() {
    const [featured, setFeatured] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            productsAPI.getFeatured(4),
            productsAPI.getNewArrivals(4),
            categoriesAPI.getAll(),
        ])
            .then(([featuredRes, newRes, catRes]) => {
                setFeatured(featuredRes.data);
                setNewArrivals(newRes.data);
                setCategories(catRes.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="page pb-safe-nav">
            <Header />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white blur-3xl"></div>
                </div>

                <div className="container-app py-12 relative">
                    <div className="max-w-lg">
                        <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                            ✨ Premium Quality
                        </span>
                        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-4 leading-tight">
                            Transform Your Space with Classic Elegance
                        </h1>
                        <p className="text-primary-100 mb-6">
                            Discover handcrafted sofasets, chairs, and dining sets that blend comfort with timeless style.
                        </p>
                        <Link to="/products" className="btn bg-white text-primary-700 hover:bg-primary-50">
                            Shop Now
                            <i className="fas fa-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="container-app py-8">
                <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
                    Shop by Category
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            to={`/products?category=${cat.slug}`}
                            className="card-hover p-4 text-center group"
                        >
                            <div className="w-14 h-14 mx-auto mb-3 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                <i className={`fas ${cat.slug === 'sofasets' ? 'fa-couch' :
                                        cat.slug === 'chairs' ? 'fa-chair' :
                                            cat.slug === 'dining-sets' ? 'fa-utensils' :
                                                'fa-briefcase'
                                    } text-xl`}></i>
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm">{cat.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">{cat.product_count} items</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="container-app py-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-xl font-bold text-gray-900">
                        Featured Products
                    </h2>
                    <Link to="/products?featured=true" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                        View All <i className="fas fa-chevron-right text-xs ml-1"></i>
                    </Link>
                </div>

                {loading ? (
                    <ProductGridSkeleton count={4} />
                ) : featured.length > 0 ? (
                    <div className="product-grid">
                        {featured.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <i className="fas fa-couch text-4xl mb-3 opacity-50"></i>
                        <p>No featured products yet.</p>
                    </div>
                )}
            </section>

            {/* New Arrivals */}
            <section className="container-app py-8 pb-24">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-xl font-bold text-gray-900">
                        New Arrivals
                    </h2>
                    <Link to="/products?sort=newest" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                        View All <i className="fas fa-chevron-right text-xs ml-1"></i>
                    </Link>
                </div>

                {loading ? (
                    <ProductGridSkeleton count={4} />
                ) : newArrivals.length > 0 ? (
                    <div className="product-grid">
                        {newArrivals.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <i className="fas fa-box-open text-4xl mb-3 opacity-50"></i>
                        <p>No products yet.</p>
                    </div>
                )}
            </section>

            {/* WhatsApp FAB */}
            <WhatsAppButton />
        </div>
    );
}
