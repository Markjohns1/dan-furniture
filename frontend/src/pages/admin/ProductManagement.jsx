/**
 * Dan Classic Furniture - Admin Product Management
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productsAPI, categoriesAPI, API_HOST } from '../../api';
import Header from '../../components/layout/Header';
import { LoadingSpinner } from '../../components/ui/Loading';

export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([
            productsAPI.getAll({ limit: 100 }),
            categoriesAPI.getAll(),
        ])
            .then(([productsRes, categoriesRes]) => {
                setProducts(productsRes.data.products);
                setCategories(categoriesRes.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        setDeleting(id);
        try {
            await productsAPI.delete(id);
            setProducts(products.filter((p) => p.id !== id));
        } catch (error) {
            alert('Failed to delete product');
        }
        setDeleting(null);
    };

    if (loading) {
        return (
            <div className="page pb-safe-nav">
                <Header title="Products" showBack />
                <div className="flex items-center justify-center py-20">
                    <LoadingSpinner size="lg" />
                </div>
            </div>
        );
    }

    return (
        <div className="page pb-safe-nav">
            <Header title="Products" />

            <div className="container-app py-6 mt-6">
                {/* Header Actions */}
                <div className="flex justify-end mb-6">
                    <Link to="/admin/products/new" className="btn btn-primary shadow-lg w-full sm:w-auto px-6 py-2.5">
                        <i className="fas fa-plus"></i>
                        Add New Product
                    </Link>
                </div>

                {/* Product List */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {products.map((product) => (
                            <div key={product.id} className="card p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow group relative bg-white">
                                <div className="flex gap-4">
                                    {/* Image */}
                                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
                                        {product.images?.[0] ? (
                                            <img
                                                src={`${API_HOST}${product.images[0]}`}
                                                alt=""
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <i className="fas fa-couch text-gray-300 text-2xl"></i>
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-bold text-gray-900 line-clamp-1 text-base">
                                                    {product.name}
                                                </h3>
                                                {product.featured && (
                                                    <span className="badge-primary text-[10px] px-2 py-0.5 shrink-0 rounded-full">Featured</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 font-medium">
                                                {product.category?.name}
                                            </p>
                                        </div>

                                        <div className="flex items-end justify-between mt-2">
                                            <p className="text-lg font-bold text-gray-900">
                                                <span className="text-xs text-gray-400 font-normal mr-1">KSh</span>
                                                {product.price.toLocaleString()}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    to={`/admin/products/${product.id}`}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors border border-gray-200"
                                                >
                                                    <i className="fas fa-edit text-sm"></i>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    disabled={deleting === product.id}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors border border-gray-200"
                                                >
                                                    {deleting === product.id ? (
                                                        <LoadingSpinner size="sm" />
                                                    ) : (
                                                        <i className="fas fa-trash text-sm"></i>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <i className="fas fa-box-open text-5xl text-gray-300 mb-4"></i>
                        <p className="text-gray-500">No products yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
