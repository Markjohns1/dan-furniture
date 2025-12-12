/**
 * Dan Classic Furniture - Products Page
 * Professional catalog with filters
 */
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../../api';
import Header from '../../components/layout/Header';
import ProductCard from '../../components/product/ProductCard';
import { ProductGridSkeleton } from '../../components/ui/Loading';
import WhatsAppButton from '../../components/ui/WhatsAppButton';
import SEO from '../../components/ui/SEO';

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

    return (
        <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
            <SEO
                title={pageTitle}
                description={`Browse ${pagination.total} quality ${categorySlug || 'furniture'} products. Affordable prices, doorstep delivery via WhatsApp in Kenya.`}
                url={`/products${categorySlug ? `?category=${categorySlug}` : ''}`}
            />
            <Header title="Products" showBack />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {categorySlug
                            ? categories.find(c => c.slug === categorySlug)?.name || 'Products'
                            : featured === 'true'
                                ? 'Featured Products'
                                : 'All Products'
                        }
                    </h1>
                    <p className="text-gray-600 mt-1">{pagination.total} products available</p>
                </div>

                {/* Filters Bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            className="w-full pl-12 pr-24 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700"
                        >
                            Search
                        </button>
                    </form>

                    {/* Sort & Filter Controls */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 lg:hidden"
                        >
                            <i className="fas fa-filter"></i>
                            Filter
                        </button>

                        <select
                            value={sort}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="px-4 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="newest">Newest</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                            <option value="name">Name A-Z</option>
                        </select>
                    </div>
                </div>

                <div className="lg:flex lg:gap-8">
                    {/* Desktop Sidebar Filters */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                            <ul className="space-y-1">
                                <li>
                                    <button
                                        onClick={() => handleCategoryChange(null)}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${!categorySlug
                                            ? 'bg-primary-50 text-primary-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        All Products
                                    </button>
                                </li>
                                {categories.map((cat) => (
                                    <li key={cat.id}>
                                        <button
                                            onClick={() => handleCategoryChange(cat.slug)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${categorySlug === cat.slug
                                                ? 'bg-primary-50 text-primary-700 font-medium'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {cat.name}
                                            <span className="text-gray-400 text-sm ml-2">({cat.product_count || 0})</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {/* Active Filters */}
                        {(categorySlug || featured) && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {categorySlug && (
                                    <button
                                        onClick={() => handleCategoryChange(null)}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 text-primary-700 text-sm font-medium rounded-full hover:bg-primary-200"
                                    >
                                        {categories.find((c) => c.slug === categorySlug)?.name}
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
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 text-primary-700 text-sm font-medium rounded-full hover:bg-primary-200"
                                    >
                                        Featured
                                        <i className="fas fa-times text-xs"></i>
                                    </button>
                                )}
                            </div>
                        )}

                        {loading ? (
                            <ProductGridSkeleton count={8} />
                        ) : products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.pages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-10">
                                        <button
                                            onClick={() => {
                                                const newParams = new URLSearchParams(searchParams);
                                                newParams.set('page', String(page - 1));
                                                setSearchParams(newParams);
                                                window.scrollTo(0, 0);
                                            }}
                                            disabled={page <= 1}
                                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <i className="fas fa-chevron-left"></i>
                                        </button>

                                        <span className="px-4 py-2 bg-primary-50 text-primary-700 font-medium rounded-lg">
                                            Page {page} of {pagination.pages}
                                        </span>

                                        <button
                                            onClick={() => {
                                                const newParams = new URLSearchParams(searchParams);
                                                newParams.set('page', String(page + 1));
                                                setSearchParams(newParams);
                                                window.scrollTo(0, 0);
                                            }}
                                            disabled={page >= pagination.pages}
                                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <i className="fas fa-chevron-right"></i>
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl">
                                <i className="fas fa-search text-5xl text-gray-300 mb-4"></i>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSearchParams({});
                                    }}
                                    className="px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Mobile Filter Sheet */}
            {showFilters && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                        onClick={() => setShowFilters(false)}
                    />
                    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[70vh] overflow-auto lg:hidden animate-slide-up">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Filter Products</h3>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <i className="fas fa-times text-gray-500"></i>
                                </button>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">Category</h4>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleCategoryChange(null)}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${!categorySlug
                                            ? 'bg-primary-100 text-primary-700 font-medium'
                                            : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        All Categories
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategoryChange(cat.slug)}
                                            className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${categorySlug === cat.slug
                                                ? 'bg-primary-100 text-primary-700 font-medium'
                                                : 'bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            {cat.name}
                                            <span className="text-gray-400 ml-2">({cat.product_count || 0})</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <WhatsAppButton />
        </div>
    );
}
