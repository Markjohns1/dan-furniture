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
            <Header />

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900"></div>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-400 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 lg:py-28">
                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-full text-white text-sm font-medium mb-6">
                            <i className="fas fa-star text-yellow-300"></i>
                            Premium Quality Furniture
                        </span>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                            Transform Your Space <br className="hidden sm:block" />
                            <span className="text-primary-200">with Classic Elegance</span>
                        </h1>
                        <p className="text-lg text-primary-100 mb-8 max-w-lg">
                            Discover handcrafted sofasets, chairs, and dining sets that blend exceptional comfort with timeless style.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/products"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-white text-primary-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all"
                            >
                                Shop Now
                                <i className="fas fa-arrow-right"></i>
                            </Link>
                            <a
                                href="https://wa.me/254700000000"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                            >
                                <i className="fab fa-whatsapp text-xl"></i>
                                Contact Us
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
                <div className="text-center mb-8 sm:mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Shop by Category</h2>
                    <p className="text-gray-600 max-w-md mx-auto">Find the perfect furniture for every room in your home</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            to={`/products?category=${cat.slug}`}
                            className="group relative bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary-200 transition-all duration-300"
                        >
                            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl flex items-center justify-center group-hover:from-primary-600 group-hover:to-primary-500 transition-colors duration-300">
                                <i className={`fas ${categoryIcons[cat.slug] || 'fa-couch'} text-xl sm:text-2xl text-primary-600 group-hover:text-white transition-colors`}></i>
                            </div>
                            <h3 className="text-center font-semibold text-gray-900 mb-1 text-sm sm:text-base">{cat.name}</h3>
                            <p className="text-center text-xs sm:text-sm text-gray-500">{cat.product_count || 0} items</p>
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
                            className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                        >
                            <i className="fab fa-whatsapp text-2xl"></i>
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
                                <span className="font-bold text-white text-lg">Dan Classic</span>
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
                        <p>© 2024 Dan Classic Furniture. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* WhatsApp FAB */}
            <WhatsAppButton />
        </div>
    );
}
