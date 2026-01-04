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
                title="Daniel Furniture - World-Class Premium Furniture Store"
                description="Explore Kenya's most massive collection of handcrafted sofasets, dining sets, accent chairs, and office furniture. Handcrafted premium furniture with doorstep delivery. Kenyatta Road, Nairobi."
                url="/"
            />
            <Header />

            {/* Hero Section - World-Class & Immersive */}
            <section className="relative px-4 pt-16 pb-16 sm:py-32 lg:py-48 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 overflow-hidden">
                {/* Decorative Pattern Background */}
                <div className="absolute inset-0 z-0 opacity-15">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                </div>
                {/* Enhanced Ambient Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary-400/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/4"></div>

                <div className="relative z-10 max-w-7xl mx-auto text-left sm:text-center">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-accent-600/20 backdrop-blur-md border border-accent-600/30 text-accent-300 text-[10px] font-bold tracking-[0.3em] uppercase mb-8 animate-fade-in">
                        World-Class Furniture Collection
                    </span>
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-medium text-white leading-[1.15] mb-6 tracking-tight">
                        Timeless Design <br className="hidden sm:block" />
                        <span className="text-accent-400 italic">Perfectly Crafted</span>
                    </h1>
                    <p className="text-base sm:text-lg text-white mb-10 max-w-2xl mx-auto font-medium leading-relaxed opacity-95">
                        Explore Kenya's most massive collection of premium sofasets, dining sets, and bespoke furniture.
                        Where world-class quality meets uncompromising comfort.
                    </p>
                    <div className="flex flex-row w-full sm:w-auto items-center sm:justify-center gap-3 sm:gap-5">
                        <Link
                            to="/products"
                            className="btn-primary flex-1 sm:flex-none sm:min-w-[200px] text-sm sm:text-lg py-3 sm:py-5 shadow-2xl hover:shadow-accent-600/20 active:scale-95 transition-all text-center justify-center"
                        >
                            Explore Collection
                        </Link>
                        <a
                            href="https://wa.me/254724426993"
                            className="btn-secondary flex-1 sm:flex-none sm:min-w-[200px] text-sm sm:text-lg py-3 sm:py-5 border-white/20 bg-white/5 text-white hover:bg-white hover:text-primary-950 backdrop-blur-md active:scale-95 transition-all flex items-center justify-center"
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
                            <p className="text-xs text-secondary-600 font-bold uppercase tracking-wider">Free Delivery</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-primary-900 font-display font-bold text-lg">Quality</p>
                            <p className="text-xs text-secondary-600 font-bold uppercase tracking-wider">Guaranteed</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-primary-900 font-display font-bold text-lg">4.9/5</p>
                            <p className="text-xs text-secondary-600 font-bold uppercase tracking-wider">Customer Rating</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-primary-900 font-display font-bold text-lg">24/7</p>
                            <p className="text-xs text-secondary-600 font-bold uppercase tracking-wider">Support</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Category Pills - Mobile First */}
            <div className="bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm overflow-hidden group/marquee">
                <div className="max-w-7xl mx-auto px-4 py-4 overflow-hidden">
                    <div className="flex items-center gap-4 lg:gap-8 whitespace-nowrap animate-marquee lg:animate-none lg:justify-center lg:flex-wrap w-max lg:w-full">
                        {/* Correctly combined and doubled array for infinite horizontal scroll on mobile */}
                        {[...[{ id: 'all', name: 'All', slug: '' }, ...categories], ...[{ id: 'all', name: 'All', slug: '' }, ...categories]].map((cat, index) => (
                            <Link
                                key={`${cat.id}-${index}`}
                                to={cat.id === 'all' ? '/products' : `/products?category=${cat.slug}`}
                                className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] transition-all flex items-center gap-2.5 shadow-sm border ${cat.id === 'all'
                                    ? 'bg-primary-950 text-white border-primary-950 scale-105 z-10'
                                    : 'bg-white text-secondary-900 font-black border-secondary-100 hover:border-primary-300 hover:bg-primary-50 active:scale-95'
                                    }`}
                            >
                                {cat.id !== 'all' && (
                                    <i className={`fas ${categoryIcons[cat.slug] || 'fa-tag'} text-[10px] text-primary-400`}></i>
                                )}
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cinematic Categories Grid */}
            <section className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-display font-medium text-primary-900 mb-3">Curated Categories</h2>
                        <p className="text-secondary-800 font-medium">Browse our signature collections for every room.</p>
                    </div>
                    <Link to="/products" className="text-accent-700 font-medium hover:text-accent-800 transition-colors border-b border-accent-300 pb-0.5">
                        View All Categories
                    </Link>
                </div>

                {/* Desktop Grid */}
                <div className="hidden lg:grid lg:grid-cols-4 gap-4">
                    {[
                        { id: 'sofasets', icon: 'fa-couch', color: 'from-amber-800 to-amber-950', label: 'Sofasets' },
                        { id: 'dining-sets', icon: 'fa-utensils', color: 'from-emerald-800 to-emerald-950', label: 'Dining Sets' },
                        { id: 'beds', icon: 'fa-bed', color: 'from-indigo-800 to-indigo-950', label: 'Beds' },
                        { id: 'chairs', icon: 'fa-chair', color: 'from-rose-800 to-rose-950', label: 'Accent Chairs' }
                    ].map((item) => (
                        <Link
                            key={item.id}
                            to={`/products?category=${item.id}`}
                            className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} transition-all duration-500 group-hover:scale-105`}></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <i className={`fas ${item.icon} text-8xl text-white/20 group-hover:text-white/30 transition-all duration-500 group-hover:scale-110`}></i>
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

                {/* Mobile Stepped Carousel */}
                <div className="lg:hidden w-full overflow-hidden -mx-4 px-4">
                    <div className="animate-carousel-steps flex">
                        {[
                            { id: 'sofasets', icon: 'fa-couch', color: 'from-amber-800 to-amber-950', label: 'Sofasets' },
                            { id: 'dining-sets', icon: 'fa-utensils', color: 'from-emerald-800 to-emerald-950', label: 'Dining Sets' },
                            { id: 'beds', icon: 'fa-bed', color: 'from-indigo-800 to-indigo-950', label: 'Beds' },
                            { id: 'chairs', icon: 'fa-chair', color: 'from-rose-800 to-rose-950', label: 'Accent Chairs' },
                            // Duplicate for infinite loop
                            { id: 'sofasets-dup', linkId: 'sofasets', icon: 'fa-couch', color: 'from-amber-800 to-amber-950', label: 'Sofasets' },
                            { id: 'dining-sets-dup', linkId: 'dining-sets', icon: 'fa-utensils', color: 'from-emerald-800 to-emerald-950', label: 'Dining Sets' },
                            { id: 'beds-dup', linkId: 'beds', icon: 'fa-bed', color: 'from-indigo-800 to-indigo-950', label: 'Beds' },
                            { id: 'chairs-dup', linkId: 'chairs', icon: 'fa-chair', color: 'from-rose-800 to-rose-950', label: 'Accent Chairs' }
                        ].map((item, index) => (
                            <div key={`${item.id}-${index}`} className="w-[12.5%] px-1.5">
                                <Link
                                    to={`/products?category=${item.linkId || item.id}`}
                                    className="block relative h-48 rounded-2xl overflow-hidden shadow-lg"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`}></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <i className={`fas ${item.icon} text-5xl text-white/20`}></i>
                                    </div>
                                    <div className="absolute inset-0 bg-black/10"></div>
                                    <div className="absolute bottom-0 left-0 p-4 w-full">
                                        <h3 className="text-lg font-bold text-white leading-none tracking-tight">{item.label}</h3>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Section - World Class Layout */}
            <section className="relative py-20 bg-white overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-50/30 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div className="max-w-xl">
                            <span className="text-accent-600 text-[10px] font-bold uppercase tracking-[0.3em] block mb-3">Our Selection</span>
                            <h2 className="text-3xl sm:text-5xl font-display font-medium text-primary-950 mb-4">Featured Collection</h2>
                            <p className="text-secondary-700 font-medium leading-relaxed">
                                Hand-picked favorites that define the Daniel Furniture aesthetic. <br className="hidden sm:block" />
                                Each piece is crafted with obsessive attention to detail.
                            </p>
                        </div>
                        <Link
                            to="/products?featured=true"
                            className="group flex items-center gap-3 text-primary-950 font-bold text-sm uppercase tracking-widest hover:text-accent-700 transition-colors"
                        >
                            Explore All <span className="w-10 h-0.5 bg-accent-600 group-hover:w-16 transition-all duration-300"></span>
                        </Link>
                    </div>

                    {loading ? (
                        <ProductGridSkeleton count={4} />
                    ) : featured.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featured.slice(0, 4).map((product) => (
                                <div key={product.id} className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
                            <i className="fas fa-couch text-4xl text-gray-200 mb-4"></i>
                            <p className="text-secondary-400 font-medium">Curating your collection...</p>
                        </div>
                    )}
                </div>
            </section>

            {/* New Arrivals Section - Immersive Grid */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16 px-4">
                        <span className="text-accent-600 text-[10px] font-bold uppercase tracking-[0.3em] block mb-4">Just Landed</span>
                        <h2 className="text-3xl sm:text-5xl font-display font-medium text-primary-950 mb-6">New Arrivals</h2>
                        <div className="w-24 h-1 bg-accent-600 mx-auto rounded-full"></div>
                    </div>

                    {loading ? (
                        <ProductGridSkeleton count={8} />
                    ) : newArrivals.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
                                {newArrivals.slice(0, 8).map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                            <div className="mt-16 text-center">
                                <Link
                                    to="/products?sort=newest"
                                    className="btn-secondary px-10 py-4 !rounded-full shadow-lg hover:shadow-xl transition-all font-bold uppercase tracking-widest text-[10px]"
                                >
                                    Browse New Styles
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100">
                            <p className="text-gray-400 font-medium">Fresh pieces arriving soon.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl overflow-hidden">
                    <div className="p-8 sm:p-12 lg:p-16 text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                            Need Help Choosing?
                        </h2>
                        <p className="text-white/90 max-w-lg mx-auto mb-8 font-medium">
                            Our team is here to help you find the perfect furniture for your space. Contact us via WhatsApp for personalized recommendations.
                        </p>
                        <a
                            href="https://wa.me/254724426993"
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



            {/* WhatsApp FAB */}
            <WhatsAppButton />
        </div>
    );
}
