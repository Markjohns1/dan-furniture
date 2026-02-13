/**
 * Dan Classic Furniture - Home Page
 * Professional mobile-first design with premium UI/UX
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
        'beds': 'fa-bed',
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
            <SEO
                title="Touch Wood - Premium Handcrafted Furniture"
                description="Kenya's most massive collection of handcrafted sofasets, dining sets, accent chairs, and office furniture. Handcrafted premium furniture with doorstep delivery. Nairobi, Kenya."
                url="/"
            />
            <Header />

            {/* Hero Section - Immersive & Premium */}
            <section className="relative px-4 pt-20 pb-20 sm:py-32 lg:py-44 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 overflow-hidden">
                {/* Animated Decorative Pattern Background */}
                <div className="absolute inset-0 z-0 hero-pattern opacity-60"></div>

                {/* Premium Ambient Glows */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/15 to-orange-500/5 rounded-full blur-[130px] -translate-y-1/3 translate-x-1/4 animate-pulse-soft"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-primary-400/10 to-blue-500/5 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-white/[0.02] to-transparent rounded-full"></div>

                <div className="relative z-10 max-w-6xl mx-auto text-left sm:text-center">
                    {/* Premium Badge */}
                    <span className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/10 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[11px] font-bold tracking-[0.25em] uppercase mb-8 animate-fade-in-down shadow-lg shadow-amber-500/10">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                        Premium Handcrafted Furniture
                    </span>

                    {/* Main Heading with Gradient */}
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-medium text-white leading-[1.1] mb-6 tracking-tight animate-fade-in-up">
                        Touch of Nature <br className="hidden sm:block" />
                        <span className="gradient-text-premium italic font-semibold">Masterfully Crafted</span>
                    </h1>

                    {/* Subtitle with Enhanced Typography */}
                    <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-12 max-w-2xl mx-auto font-medium leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        Explore our massive collection of premium sofasets, dining sets, and bespoke furniture.
                        <span className="hidden sm:inline"> Where world-class quality meets uncompromising comfort.</span>
                    </p>

                    {/* CTA Buttons with Premium Styling */}
                    <div className="flex flex-row w-full sm:w-auto items-center sm:justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <Link
                            to="/products"
                            className="btn-primary flex-1 sm:flex-none sm:min-w-[220px] text-sm sm:text-base py-4 sm:py-5 shadow-2xl shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-95 transition-all text-center justify-center"
                        >
                            <i className="fas fa-th-large text-sm opacity-80"></i>
                            Explore Collection
                        </Link>
                        <a
                            href="https://wa.me/254799366734"
                            target="_blank"
                            rel="noreferrer"
                            className="btn flex-1 sm:flex-none sm:min-w-[200px] text-sm sm:text-base py-4 sm:py-5 bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary-950 backdrop-blur-md active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <i className="fab fa-whatsapp text-lg"></i>
                            <span className="hidden sm:inline">WhatsApp Us</span>
                            <span className="sm:hidden">Chat</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* Trust Signals Strip - Enhanced */}
            <div className="border-b border-gray-100 bg-white relative z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { title: 'Nairobi', subtitle: 'Free Delivery', icon: 'fa-truck' },
                            { title: 'Quality', subtitle: 'Guaranteed', icon: 'fa-medal' },
                            { title: '4.9/5', subtitle: 'Customer Rating', icon: 'fa-star' },
                            { title: '24/7', subtitle: 'Support', icon: 'fa-headset' },
                        ].map((item, index) => (
                            <div key={index} className="space-y-2 group">
                                <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <i className={`fas ${item.icon} text-primary-700`}></i>
                                </div>
                                <p className="text-primary-900 font-display font-bold text-xl">{item.title}</p>
                                <p className="text-xs text-secondary-600 font-bold uppercase tracking-wider">{item.subtitle}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Interactive Category Pills */}
            <div className="bg-white border-b border-gray-100 sticky top-20 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 overflow-x-auto scrollbar-hide">
                    {/* Desktop: Static centered pills */}
                    <div className="hidden lg:flex items-center gap-4 justify-center flex-wrap">
                        <Link
                            to="/products"
                            className="px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] transition-all flex items-center gap-2 border bg-primary-950 text-white border-primary-950 shadow-lg shadow-primary-950/20"
                        >
                            All Products
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                to={`/products?category=${cat.slug}`}
                                className="px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] transition-all flex items-center gap-2.5 border bg-white text-secondary-800 border-secondary-200 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700 active:scale-95"
                            >
                                <i className={`fas ${categoryIcons[cat.slug] || 'fa-tag'} text-[10px] text-primary-500`}></i>
                                {cat.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile: Horizontal scroll with marquee */}
                    <div className="lg:hidden flex items-center gap-3 w-max animate-marquee">
                        {[...categories, ...categories].map((cat, index) => (
                            <Link
                                key={`${cat.id}-${index}`}
                                to={`/products?category=${cat.slug}`}
                                className="px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] transition-all flex items-center gap-2.5 border bg-white text-secondary-800 border-secondary-200 active:scale-95 flex-shrink-0"
                            >
                                <i className={`fas ${categoryIcons[cat.slug] || 'fa-tag'} text-[10px] text-primary-500`}></i>
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cinematic Categories Grid - Enhanced */}
            <section className="max-w-7xl mx-auto px-4 py-20 sm:py-28">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
                    <div className="max-w-xl">
                        <span className="text-amber-600 text-[11px] font-bold uppercase tracking-[0.25em] block mb-3">Shop by Category</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-primary-950 mb-4 leading-tight">Curated Collections</h2>
                        <p className="text-secondary-700 font-medium text-lg">Browse our signature collections crafted for every room in your home.</p>
                    </div>
                    <Link to="/products" className="group flex items-center gap-3 text-primary-950 font-bold text-sm uppercase tracking-widest hover:text-amber-700 transition-colors">
                        View All <span className="w-8 h-0.5 bg-amber-500 group-hover:w-14 transition-all duration-300"></span>
                    </Link>
                </div>

                {/* Desktop Grid - Premium Cards */}
                <div className="hidden lg:grid lg:grid-cols-4 gap-5">
                    {[
                        { id: 'sofasets', icon: 'fa-couch', color: 'from-amber-700 via-amber-800 to-amber-950', label: 'Sofasets', count: '50+ Items' },
                        { id: 'dining-sets', icon: 'fa-utensils', color: 'from-emerald-700 via-emerald-800 to-emerald-950', label: 'Dining Sets', count: '30+ Items' },
                        { id: 'beds', icon: 'fa-bed', color: 'from-indigo-700 via-indigo-800 to-indigo-950', label: 'Beds', count: '25+ Items' },
                        { id: 'chairs', icon: 'fa-chair', color: 'from-rose-700 via-rose-800 to-rose-950', label: 'Accent Chairs', count: '40+ Items' }
                    ].map((item) => (
                        <Link
                            key={item.id}
                            to={`/products?category=${item.id}`}
                            className="group relative h-[420px] rounded-3xl overflow-hidden cursor-pointer hover-lift"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} transition-all duration-700 group-hover:scale-105`}></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <i className={`fas ${item.icon} text-9xl text-white/15 group-hover:text-white/25 transition-all duration-700 group-hover:scale-110 group-hover:rotate-3`}></i>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-7 w-full">
                                <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest block mb-2">{item.count}</span>
                                <h3 className="text-2xl font-display font-semibold text-white mb-2">{item.label}</h3>
                                <div className="flex items-center gap-2 text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    Explore Collection <i className="fas fa-arrow-right text-xs"></i>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Mobile Carousel - Enhanced */}
                <div className="lg:hidden w-full overflow-hidden -mx-4 px-4">
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                        {[
                            { id: 'sofasets', icon: 'fa-couch', color: 'from-amber-700 to-amber-950', label: 'Sofasets' },
                            { id: 'dining-sets', icon: 'fa-utensils', color: 'from-emerald-700 to-emerald-950', label: 'Dining Sets' },
                            { id: 'beds', icon: 'fa-bed', color: 'from-indigo-700 to-indigo-950', label: 'Beds' },
                            { id: 'chairs', icon: 'fa-chair', color: 'from-rose-700 to-rose-950', label: 'Accent Chairs' }
                        ].map((item) => (
                            <Link
                                key={item.id}
                                to={`/products?category=${item.id}`}
                                className="flex-shrink-0 w-[75vw] max-w-[280px] snap-center"
                            >
                                <div className={`relative h-56 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br ${item.color}`}>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <i className={`fas ${item.icon} text-6xl text-white/20`}></i>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-5 w-full">
                                        <h3 className="text-xl font-bold text-white">{item.label}</h3>
                                        <p className="text-white/70 text-sm mt-1">View Collection →</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Section - Premium Layout */}
            <section className="relative py-24 bg-white overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-50/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary-50/50 to-transparent blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
                        <div className="max-w-xl">
                            <span className="text-amber-600 text-[11px] font-bold uppercase tracking-[0.25em] block mb-3">Our Selection</span>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-primary-950 mb-4 leading-tight">Featured Collection</h2>
                            <p className="text-secondary-700 font-medium text-lg leading-relaxed">
                                Hand-picked favorites that define the Daniel Furniture aesthetic.
                                <span className="hidden sm:inline"> Each piece is crafted with obsessive attention to detail.</span>
                            </p>
                        </div>
                        <Link
                            to="/products?featured=true"
                            className="group flex items-center gap-3 text-primary-950 font-bold text-sm uppercase tracking-widest hover:text-amber-700 transition-colors"
                        >
                            Explore All <span className="w-8 h-0.5 bg-amber-500 group-hover:w-14 transition-all duration-300"></span>
                        </Link>
                    </div>

                    {loading ? (
                        <ProductGridSkeleton count={4} />
                    ) : featured.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                            {featured.slice(0, 4).map((product, index) => (
                                <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                            <i className="fas fa-couch text-5xl text-gray-300 mb-4"></i>
                            <p className="text-secondary-500 font-medium text-lg">Curating your collection...</p>
                        </div>
                    )}
                </div>
            </section>

            {/* New Arrivals Section - Enhanced Grid */}
            <section className="py-24 bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16 px-4">
                        <span className="text-amber-600 text-[11px] font-bold uppercase tracking-[0.25em] block mb-4">Just Landed</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-primary-950 mb-6">New Arrivals</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full"></div>
                    </div>

                    {loading ? (
                        <ProductGridSkeleton count={8} />
                    ) : newArrivals.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                                {newArrivals.slice(0, 8).map((product, index) => (
                                    <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 75}ms` }}>
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-16 text-center">
                                <Link
                                    to="/products?sort=newest"
                                    className="btn-secondary px-10 py-4 !rounded-full shadow-lg hover:shadow-xl transition-all font-bold uppercase tracking-widest text-[11px] hover-lift"
                                >
                                    Browse New Styles
                                    <i className="fas fa-arrow-right ml-2 text-xs"></i>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                            <i className="fas fa-box-open text-5xl text-gray-300 mb-4"></i>
                            <p className="text-gray-500 font-medium text-lg">Fresh pieces arriving soon.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section - Premium Glass Design */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="relative bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 rounded-[2rem] overflow-hidden shadow-2xl">
                    {/* Background Elements */}
                    <div className="absolute inset-0 hero-pattern opacity-30"></div>
                    <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400/10 rounded-full blur-[80px]"></div>

                    <div className="relative p-8 sm:p-12 lg:p-20 text-center">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-amber-300 text-[10px] font-bold tracking-widest uppercase mb-6">
                            <i className="fas fa-headset"></i>
                            Personal Assistance
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-white mb-5">
                            Need Help Choosing?
                        </h2>
                        <p className="text-white/85 max-w-lg mx-auto mb-10 font-medium text-lg leading-relaxed">
                            Our furniture experts are here to help you find the perfect pieces for your space. Get personalized recommendations via WhatsApp.
                        </p>
                        <a
                            href="https://wa.me/254724426993"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-2xl hover:from-green-600 hover:to-green-700 transition-all shadow-xl shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-1"
                        >
                            <i className="fab fa-whatsapp text-2xl"></i>
                            Chat on WhatsApp
                        </a>
                    </div>
                </div>
            </section>

            {/* WhatsApp FAB */}
            <WhatsAppButton />
        </div>
    );
}
