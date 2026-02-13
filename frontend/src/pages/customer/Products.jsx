/**
 * Touch Wood - Products Page
 * Professional catalog with premium filters
 */
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../../api';
import Header from '../../components/layout/Header';
import ProductCard from '../../components/product/ProductCard';
import { ProductGridSkeleton } from '../../components/ui/Loading';
import WhatsAppButton from '../../components/ui/WhatsAppButton';
import SEO from '../../components/ui/SEO';
import Breadcrumbs from '../../components/ui/Breadcrumbs';

export default function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

    // Filters from URL
    const categorySlug = searchParams.get('category');
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page')) || 1;

    useEffect(() => {
        categoriesAPI.getAll().then((res) => setCategories(res.data)).catch(() => { });
    }, []);

    useEffect(() => {
        setLoading(true);
        const category = categories.find((c) => c.slug === categorySlug);

        const params = {
            page,
            limit: 12,
            sort,
            search: searchQuery || undefined,
            category_id: category?.id,
            featured: featured === 'true' ? true : undefined,
        };

        productsAPI.getAll(params)
            .then((res) => {
                setProducts(res.data.products);
                setPagination({
                    page: res.data.page,
                    pages: res.data.pages,
                    total: res.data.total,
                });
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [categorySlug, featured, sort, page, searchQuery, categories]);

    const handleSearch = (e) => {
        e.preventDefault();
        const newParams = new URLSearchParams(searchParams);
        if (searchQuery) {
            newParams.set('search', searchQuery);
        } else {
            newParams.delete('search');
        }
        newParams.delete('page');
        setSearchParams(newParams);
    };

    const handleSortChange = (newSort) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('sort', newSort);
        newParams.delete('page');
        setSearchParams(newParams);
    };

    const handleCategoryChange = (slug) => {
        const newParams = new URLSearchParams();
        if (slug) newParams.set('category', slug);
        newParams.set('sort', sort);
        setSearchParams(newParams);
        setShowFilters(false);
    };

    const pageTitle = categorySlug
        ? `${categories.find(c => c.slug === categorySlug)?.name || 'Products'} - Shop Now`
        : featured === 'true'
            ? 'Featured Products'
            : 'All Furniture Products';

    const categoryName = categories.find(c => c.slug === categorySlug)?.name;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-24 lg:pb-12">
            <SEO
                title={pageTitle}
                description={`Browse ${pagination.total} quality ${categorySlug || 'furniture'} products. Affordable prices, doorstep delivery via WhatsApp in Kenya.`}
                url={`/products${categorySlug ? `?category=${categorySlug}` : ''}`}
            />
            <Header title="Products" showBack />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
                <Breadcrumbs
                    items={[
                        { label: 'Products', to: categorySlug ? '/products' : null },
                        ...(categorySlug ? [{ label: categoryName || 'Category' }] : [])
                    ]}
                />

                {/* Page Header - Enhanced */}
                <div className="mb-8 mt-2">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-display font-semibold text-primary-950 mb-2">
                                {categorySlug
                                    ? categoryName || 'Products'
                                    : featured === 'true'
                                        ? 'Featured Products'
                                        : 'All Products'
                                }
                            </h1>
                            <p className="text-secondary-600 font-medium">
                                <span className="text-primary-700 font-bold">{pagination.total}</span> products available
                            </p>
                        </div>

                        {/* Results Summary Badge */}
                        {(categorySlug || searchQuery) && (
                            <div className="flex items-center gap-2 text-sm text-secondary-600">
                                <span>Showing results for</span>
                                {categorySlug && (
                                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full font-semibold">
                                        {categoryName}
                                    </span>
                                )}
                                {searchQuery && (
                                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-semibold">
                                        "{searchQuery}"
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Filters Bar - Enhanced */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            className="w-full pl-12 pr-24 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all shadow-sm"
                        />
                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400"></i>
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-primary-950 text-white text-sm font-semibold rounded-lg hover:bg-primary-800 shadow-md transition-all active:scale-95"
                        >
                            Search
                        </button>
                    </form>

                    {/* Sort & Filter Controls */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-5 py-3.5 bg-white border border-gray-200 rounded-xl font-semibold text-secondary-700 hover:bg-gray-50 lg:hidden shadow-sm transition-all"
                        >
                            <i className="fas fa-sliders-h text-primary-600"></i>
                            Filters
                        </button>

                        <select
                            value={sort}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="px-5 py-3.5 bg-white border border-gray-200 rounded-xl font-semibold text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm appearance-none cursor-pointer min-w-[180px]"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                        >
                            <option value="newest">Newest First</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                            <option value="name">Name A-Z</option>
                        </select>
                    </div>
                </div>

                <div className="lg:flex lg:gap-8">
                    {/* Desktop Sidebar Filters - Enhanced */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-28">
                            <h3 className="font-display font-semibold text-lg text-gray-900 mb-5 flex items-center gap-2">
                                <i className="fas fa-filter text-primary-600 text-sm"></i>
                                Categories
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <button
                                        onClick={() => handleCategoryChange(null)}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${!categorySlug
                                            ? 'bg-primary-950 text-white shadow-lg shadow-primary-950/20'
                                            : 'text-secondary-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <i className={`fas fa-th-large text-sm ${!categorySlug ? 'text-amber-400' : 'text-gray-400'}`}></i>
                                        <span className="font-semibold">All Products</span>
                                    </button>
                                </li>
                                {categories.map((cat) => (
                                    <li key={cat.id}>
                                        <button
                                            onClick={() => handleCategoryChange(cat.slug)}
                                            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between ${categorySlug === cat.slug
                                                ? 'bg-primary-950 text-white shadow-lg shadow-primary-950/20'
                                                : 'text-secondary-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="font-semibold">{cat.name}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${categorySlug === cat.slug
                                                ? 'bg-white/20 text-white'
                                                : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {cat.product_count || 0}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            {/* Quick Help */}
                            <div className="mt-8 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <i className="fab fa-whatsapp text-green-600"></i>
                                    Need Help?
                                </h4>
                                <p className="text-sm text-gray-600 mb-3">Chat with us for personalized recommendations.</p>
                                <a
                                    href="https://wa.me/254724426993"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800 transition-colors"
                                >
                                    Start Chat <i className="fas fa-arrow-right text-xs"></i>
                                </a>
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {/* Active Filters Pills */}
                        {(categorySlug || featured || searchQuery) && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {categorySlug && (
                                    <button
                                        onClick={() => handleCategoryChange(null)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full hover:bg-primary-200 transition-colors"
                                    >
                                        {categoryName}
                                        <i className="fas fa-times text-xs"></i>
                                    </button>
                                )}
                                {featured && (
                                    <button
                                        onClick={() => {
                                            const newParams = new URLSearchParams(searchParams);
                                            newParams.delete('featured');
                                            setSearchParams(newParams);
                                        }}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 text-sm font-semibold rounded-full hover:bg-amber-200 transition-colors"
                                    >
                                        Featured
                                        <i className="fas fa-times text-xs"></i>
                                    </button>
                                )}
                                {searchQuery && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            const newParams = new URLSearchParams(searchParams);
                                            newParams.delete('search');
                                            setSearchParams(newParams);
                                        }}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors"
                                    >
                                        "{searchQuery}"
                                        <i className="fas fa-times text-xs"></i>
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSearchParams({});
                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-secondary-600 text-sm font-semibold hover:text-primary-700 transition-colors"
                                >
                                    Clear All
                                </button>
                            </div>
                        )}

                        {loading ? (
                            <ProductGridSkeleton count={8} />
                        ) : products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                                    {products.map((product, index) => (
                                        <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination - Enhanced */}
                                {pagination.pages > 1 && (
                                    <div className="flex items-center justify-center gap-3 mt-12">
                                        <button
                                            onClick={() => {
                                                const newParams = new URLSearchParams(searchParams);
                                                newParams.set('page', String(page - 1));
                                                setSearchParams(newParams);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            disabled={page <= 1}
                                            className="w-12 h-12 bg-white border border-gray-200 rounded-xl font-semibold text-secondary-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center"
                                        >
                                            <i className="fas fa-chevron-left text-primary-600"></i>
                                        </button>

                                        <div className="flex items-center gap-2">
                                            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                                                let pageNum;
                                                if (pagination.pages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (page <= 3) {
                                                    pageNum = i + 1;
                                                } else if (page >= pagination.pages - 2) {
                                                    pageNum = pagination.pages - 4 + i;
                                                } else {
                                                    pageNum = page - 2 + i;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => {
                                                            const newParams = new URLSearchParams(searchParams);
                                                            newParams.set('page', String(pageNum));
                                                            setSearchParams(newParams);
                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        }}
                                                        className={`w-12 h-12 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center ${page === pageNum
                                                            ? 'bg-primary-950 text-white shadow-lg shadow-primary-950/20'
                                                            : 'bg-white border border-gray-200 text-secondary-700 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <button
                                            onClick={() => {
                                                const newParams = new URLSearchParams(searchParams);
                                                newParams.set('page', String(page + 1));
                                                setSearchParams(newParams);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            disabled={page >= pagination.pages}
                                            className="w-12 h-12 bg-white border border-gray-200 rounded-xl font-semibold text-secondary-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center"
                                        >
                                            <i className="fas fa-chevron-right text-primary-600"></i>
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
                                    <i className="fas fa-search text-4xl text-gray-300"></i>
                                </div>
                                <h3 className="text-2xl font-display font-semibold text-gray-900 mb-3">No products found</h3>
                                <p className="text-secondary-500 mb-8 max-w-sm mx-auto">
                                    Try adjusting your search or filters to find what you're looking for.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSearchParams({});
                                    }}
                                    className="btn-primary px-8 py-3"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Mobile Filter Sheet - Enhanced */}
            {showFilters && (
                <>
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden animate-fade-in"
                        onClick={() => setShowFilters(false)}
                    />
                    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[75vh] overflow-auto lg:hidden animate-slide-up shadow-2xl">
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-display font-bold text-gray-900">Filter Products</h3>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <i className="fas fa-times text-gray-500"></i>
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <i className="fas fa-tags text-primary-600 text-sm"></i>
                                    Category
                                </h4>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleCategoryChange(null)}
                                        className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-200 flex items-center justify-between ${!categorySlug
                                            ? 'bg-primary-950 text-white shadow-lg'
                                            : 'bg-gray-50 text-secondary-900 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className="font-semibold">All Categories</span>
                                        {!categorySlug && <i className="fas fa-check text-amber-400"></i>}
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategoryChange(cat.slug)}
                                            className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-200 flex items-center justify-between ${categorySlug === cat.slug
                                                ? 'bg-primary-950 text-white shadow-lg'
                                                : 'bg-gray-50 text-secondary-900 hover:bg-gray-100'
                                                }`}
                                        >
                                            <span className="font-semibold">{cat.name}</span>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${categorySlug === cat.slug ? 'bg-white/20' : 'bg-gray-200'}`}>
                                                    {cat.product_count || 0}
                                                </span>
                                                {categorySlug === cat.slug && <i className="fas fa-check text-amber-400"></i>}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Apply Button */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 pb-safe">
                            <button
                                onClick={() => setShowFilters(false)}
                                className="w-full btn-primary py-4 text-base"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </>
            )}

            <WhatsAppButton />
        </div>
    );
}
