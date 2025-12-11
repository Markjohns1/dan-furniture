/**
 * Dan Classic Furniture - Products Page
 */
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../../api';
import Header from '../../components/layout/Header';
import ProductCard from '../../components/product/ProductCard';
import { ProductGridSkeleton } from '../../components/ui/Loading';
import WhatsAppButton from '../../components/ui/WhatsAppButton';

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

        // Find category ID from slug
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

    return (
        <div className="page pb-safe-nav">
            <Header title="Products" showBack />

            {/* Search Bar */}
            <div className="container-app py-4">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search furniture..."
                        className="input pl-10 pr-20"
                    />
                    <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary btn-sm"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Filter Bar */}
            <div className="container-app pb-4">
                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={() => setShowFilters(true)}
                        className="btn-outline btn-sm"
                    >
                        <i className="fas fa-filter"></i>
                        Filters
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Sort:</span>
                        <select
                            value={sort}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="input py-2 px-3 text-sm w-auto"
                        >
                            <option value="newest">Newest</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                            <option value="name">Name</option>
                        </select>
                    </div>
                </div>

                {/* Active Filters */}
                {(categorySlug || featured) && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {categorySlug && (
                            <button
                                onClick={() => handleCategoryChange(null)}
                                className="badge-primary flex items-center gap-1"
                            >
                                {categories.find((c) => c.slug === categorySlug)?.name || categorySlug}
                                <i className="fas fa-times text-[10px]"></i>
                            </button>
                        )}
                        {featured && (
                            <button
                                onClick={() => {
                                    const newParams = new URLSearchParams(searchParams);
                                    newParams.delete('featured');
                                    setSearchParams(newParams);
                                }}
                                className="badge-primary flex items-center gap-1"
                            >
                                Featured
                                <i className="fas fa-times text-[10px]"></i>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Results */}
            <div className="container-app pb-8">
                <p className="text-sm text-gray-500 mb-4">
                    {pagination.total} {pagination.total === 1 ? 'product' : 'products'} found
                </p>

                {loading ? (
                    <ProductGridSkeleton count={6} />
                ) : products.length > 0 ? (
                    <>
                        <div className="product-grid">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                <button
                                    onClick={() => {
                                        const newParams = new URLSearchParams(searchParams);
                                        newParams.set('page', String(page - 1));
                                        setSearchParams(newParams);
                                    }}
                                    disabled={page <= 1}
                                    className="btn-outline btn-sm"
                                >
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                <span className="btn-secondary btn-sm">
                                    {page} / {pagination.pages}
                                </span>
                                <button
                                    onClick={() => {
                                        const newParams = new URLSearchParams(searchParams);
                                        newParams.set('page', String(page + 1));
                                        setSearchParams(newParams);
                                    }}
                                    disabled={page >= pagination.pages}
                                    className="btn-outline btn-sm"
                                >
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <i className="fas fa-search text-5xl text-gray-300 mb-4"></i>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>

            {/* Filter Bottom Sheet */}
            {showFilters && (
                <>
                    <div className="overlay" onClick={() => setShowFilters(false)} />
                    <div className="bottom-sheet">
                        <div className="bottom-sheet-handle" />
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-display text-lg font-bold">Filters</h3>
                                <button onClick={() => setShowFilters(false)} className="text-gray-400">
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">Category</h4>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleCategoryChange(null)}
                                        className={`w-full text-left px-3 py-2 rounded-lg ${!categorySlug ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                                            }`}
                                    >
                                        All Categories
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategoryChange(cat.slug)}
                                            className={`w-full text-left px-3 py-2 rounded-lg ${categorySlug === cat.slug ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                                                }`}
                                        >
                                            {cat.name}
                                            <span className="text-gray-400 text-sm ml-2">({cat.product_count})</span>
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
