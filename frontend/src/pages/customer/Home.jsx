/**
 * Dan Classic Furniture - Home Page
 * Professional mobile-first design
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../../api';
import Header from '../../components/layout/Header';
import ProductCard from '../../components/product/ProductCard';
import { ProductGridSkeleton } from '../../components/ui/Loading';
import WhatsAppButton from '../../components/ui/WhatsAppButton';
import SEO from '../../components/ui/SEO';

export default function Home() {
    const [featured, setFeatured] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            productsAPI.getFeatured(8),
            productsAPI.getNewArrivals(8),
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

    const categoryIcons = {
        'sofasets': 'fa-couch',
        'chairs': 'fa-chair',
        'dining-sets': 'fa-utensils',
        'office-chairs': 'fa-briefcase',
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
            <SEO
                title="Premium Sofasets, Chairs & Dining Sets"
                description="Shop premium quality sofasets, chairs, dining sets, and office furniture in Kenya. Free delivery in Nairobi. Order via WhatsApp."
                url="/"
            />
            <Header />

            {/* Hero Section - Luxury & Minimal */}
            <section className="relative px-4 pt-24 pb-16 sm:py-32 lg:py-40 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 overflow-hidden">
                {/* Decorative Pattern Background */}
                <div className="absolute inset-0 z-0 opacity-10">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
                </div>
                {/* Decorative Shapes */}
                <div className="absolute top-20 right-10 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-accent-200 text-xs font-bold tracking-[0.2em] uppercase mb-6">
                        Premium Furniture Collection
                    </span>
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-medium text-white leading-tight mb-6 tracking-tight">
                        Elevate Your <br className="hidden sm:block" />
                        <span className="text-accent-400 italic">Living Space</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-primary-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                        Discover handcrafted sofas, dining sets, and accent pieces designed for timeless elegance and uncompromising comfort.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/products"
                            className="btn-primary min-w-[180px] text-lg py-4 shadow-float hover:shadow-[0_20px_40px_-10px_rgba(194,65,12,0.4)]"
                        >
                            Explore Collection
                        </Link>
                        <a
                            href="https://wa.me/254700000000"
                            className="btn-secondary min-w-[180px] text-lg py-4 border-white/10 bg-white/5 text-white hover:bg-white hover:text-primary-900 backdrop-blur-sm"
                        >
                            <i className="fab fa-whatsapp mr-2"></i> WhatsApp Us
                        </a>
                    </div>
                </div>
            </section>

            {/* Trust Signals Strip */}
            <div className="border-b border-gray-100 bg-white relative z-20">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-gray-100/50">
                        <div className="space-y-1">
                            <p className="text-primary-900 font-display font-bold text-lg">Nairobi</p>
                            <p className="text-xs text-secondary-500 uppercase tracking-wider">Free Delivery</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-primary-900 font-display font-bold text-lg">Quality</p>
                            <p className="text-xs text-secondary-500 uppercase tracking-wider">Guaranteed</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-primary-900 font-display font-bold text-lg">4.9/5</p>
                            <p className="text-xs text-secondary-500 uppercase tracking-wider">Customer Rating</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-primary-900 font-display font-bold text-lg">24/7</p>
                            <p className="text-xs text-secondary-500 uppercase tracking-wider">Support</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cinematic Categories */}
            <section className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-display font-medium text-primary-900 mb-3">Curated Categories</h2>
                        <p className="text-secondary-600">Browse our signature collections for every room.</p>
                    </div>
                    <Link to="/products" className="text-accent-700 font-medium hover:text-accent-800 transition-colors border-b border-accent-300 pb-0.5">
                        View All Categories
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Category cards with icons instead of external images */}
                    {[
                        { id: 'sofasets', icon: 'fa-couch', color: 'from-amber-800 to-amber-950', label: 'Sofasets' },
                        { id: 'dining-sets', icon: 'fa-utensils', color: 'from-emerald-800 to-emerald-950', label: 'Dining Sets' },
                        { id: 'beds', icon: 'fa-bed', color: 'from-indigo-800 to-indigo-950', label: 'Beds' },
                        { id: 'chairs', icon: 'fa-chair', color: 'from-rose-800 to-rose-950', label: 'Accent Chairs' }
                    ].map((item) => (
                        <Link
                            key={item.id}
                            to={`/products?category=${item.id}`}
                            className="group relative h-64 sm:h-96 rounded-2xl overflow-hidden cursor-pointer"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} transition-all duration-500 group-hover:scale-105`}></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <i className={`fas ${item.icon} text-6xl sm:text-8xl text-white/20 group-hover:text-white/30 transition-all duration-500 group-hover:scale-110`}></i>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                            <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-xl font-display font-medium text-white mb-1">{item.label}</h3>
                                <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    Explore Collection <i className="fas fa-arrow-right ml-1 text-xs"></i>
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="bg-white py-8 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Products</h2>
                            <p className="text-gray-600 mt-1">Hand-picked favorites for your home</p>
                        </div>
                        <Link
                            to="/products?featured=true"
                            className="hidden sm:inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700"
                        >
                            View All
                            <i className="fas fa-arrow-right text-sm"></i>
                        </Link>
                    </div>

                    {loading ? (
                        <ProductGridSkeleton count={4} />
                    ) : featured.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                                {featured.slice(0, 8).map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                            <div className="mt-8 text-center sm:hidden">
                                <Link
                                    to="/products?featured=true"
                                    className="inline-flex items-center gap-2 px-6 py-3 text-primary-600 font-semibold border-2 border-primary-600 rounded-xl hover:bg-primary-50"
                                >
                                    View All Featured
                                    <i className="fas fa-arrow-right text-sm"></i>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16 bg-gray-50 rounded-2xl">
                            <i className="fas fa-couch text-5xl text-gray-300 mb-4"></i>
                            <p className="text-gray-500 text-lg">No featured products yet</p>
                            <Link to="/products" className="mt-4 inline-block text-primary-600 font-medium hover:underline">
                                Browse all products
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* New Arrivals */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">New Arrivals</h2>
                        <p className="text-gray-600 mt-1">Fresh additions to our collection</p>
                    </div>
                    <Link
                        to="/products?sort=newest"
                        className="hidden sm:inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700"
                    >
                        View All
                        <i className="fas fa-arrow-right text-sm"></i>
                    </Link>
                </div>

                {loading ? (
                    <ProductGridSkeleton count={4} />
                ) : newArrivals.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {newArrivals.slice(0, 8).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        <div className="mt-8 text-center sm:hidden">
                            <Link
                                to="/products?sort=newest"
                                className="inline-flex items-center gap-2 px-6 py-3 text-primary-600 font-semibold border-2 border-primary-600 rounded-xl hover:bg-primary-50"
                            >
                                View All New Arrivals
                                <i className="fas fa-arrow-right text-sm"></i>
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16 bg-gray-100 rounded-2xl">
                        <i className="fas fa-box-open text-5xl text-gray-300 mb-4"></i>
                        <p className="text-gray-500 text-lg">No products yet</p>
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl overflow-hidden">
                    <div className="p-8 sm:p-12 lg:p-16 text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                            Need Help Choosing?
                        </h2>
                        <p className="text-gray-300 max-w-lg mx-auto mb-8">
                            Our team is here to help you find the perfect furniture for your space. Contact us via WhatsApp for personalized recommendations.
                        </p>
                        <a
                            href="https://wa.me/254700000000"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl"
                        >
                            <i className="fab fa-whatsapp text-xl"></i>
                            Chat on WhatsApp
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="col-span-2 lg:col-span-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                                    <i className="fas fa-couch text-white"></i>
                                </div>
                                <span className="font-bold text-white text-lg">Daniel</span>
                            </div>
                            <p className="text-sm">Premium furniture for your home. Quality craftsmanship meets timeless design.</p>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
                                <li><Link to="/products?category=sofasets" className="hover:text-white transition-colors">Sofasets</Link></li>
                                <li><Link to="/products?category=chairs" className="hover:text-white transition-colors">Chairs</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Account</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                                <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Contact</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="https://wa.me/254700000000" className="flex items-center gap-2 hover:text-white transition-colors">
                                        <i className="fab fa-whatsapp"></i>
                                        WhatsApp
                                    </a>
                                </li>
                                <li>
                                    <a href="tel:+254700000000" className="flex items-center gap-2 hover:text-white transition-colors">
                                        <i className="fas fa-phone"></i>
                                        +254 700 000 000
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-10 pt-8 text-center text-sm">
                        <p>© 2024 Daniel Furniture. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* WhatsApp FAB */}
            <WhatsAppButton />
        </div>
    );
}
