/**
 * Dan Classic Furniture - Admin Product Management
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../../api';
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

            <div className="container-app py-8 mt-4">
                {/* Add Button */}
                <Link to="/admin/products/new" className="btn-primary w-full mb-4">
                    <i className="fas fa-plus"></i>
                    Add New Product
                </Link>

                {/* Product List */}
                {products.length > 0 ? (
                    <div className="space-y-3">
                        {products.map((product) => (
                            <div key={product.id} className="card p-4">
                                <div className="flex gap-4">
                                    {/* Image */}
                                    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                        {product.images?.[0] ? (
                                            <img
                                                src={`http://localhost:8000${product.images[0]}`}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <i className="fas fa-couch text-gray-300 text-2xl"></i>
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="font-medium text-gray-900 line-clamp-1">
                                                    {product.name}
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    {product.category?.name}
                                                </p>
                                            </div>
                                            {product.featured && (
                                                <span className="badge-primary text-[10px]">Featured</span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 mt-2 text-sm">
                                            <span className="font-bold text-primary-600">
                                                KSh {product.price.toLocaleString()}
                                            </span>
                                            <span className={product.stock < 5 ? 'text-red-500' : 'text-gray-500'}>
                                                Stock: {product.stock}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                                                className="btn-secondary btn-sm flex-1"
                                            >
                                                <i className="fas fa-edit"></i>
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                disabled={deleting === product.id}
                                                className="btn-outline btn-sm text-red-500 border-red-200 hover:bg-red-50"
                                            >
                                                {deleting === product.id ? (
                                                    <i className="fas fa-spinner fa-spin"></i>
                                                ) : (
                                                    <i className="fas fa-trash"></i>
                                                )}
                                            </button>
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
