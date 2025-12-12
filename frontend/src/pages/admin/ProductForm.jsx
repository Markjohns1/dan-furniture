/**
 * Daniel Furniture - Admin Add/Edit Product
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI, categoriesAPI, API_HOST } from '../../api';
import Header from '../../components/layout/Header';
import { LoadingSpinner } from '../../components/ui/Loading';

export default function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        compare_price: '',
        category_id: '',
        stock: '',

        dimensions: '',
        material: '',
        colors: '',
        featured: false,
    });
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    useEffect(() => {
        categoriesAPI.getAll().then((res) => setCategories(res.data));

        if (isEditing) {
            productsAPI.getById(id)
                .then((res) => {
                    const product = res.data;
                    setFormData({
                        name: product.name,
                        description: product.description || '',
                        price: String(product.price),
                        compare_price: product.compare_price ? String(product.compare_price) : '',
                        category_id: String(product.category_id),
                        stock: String(product.stock),
                        dimensions: product.dimensions || '',
                        material: product.material || '',
                        colors: (product.colors || []).join(', '),
                        featured: product.featured,
                    });
                    setExistingImages(product.images || []);
                })
                .catch(() => setError('Product not found'))
                .finally(() => setLoading(false));
        }
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            const productData = {
                name: formData.name,
                description: formData.description || null,
                price: parseFloat(formData.price),
                compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
                category_id: parseInt(formData.category_id),
                stock: parseInt(formData.stock) || 0,
                sku: formData.sku || null,
                dimensions: formData.dimensions || null,
                material: formData.material || null,
                colors: formData.colors ? formData.colors.split(',').map((c) => c.trim()) : [],
                featured: formData.featured,
                images: existingImages,
            };

            let productId = id;

            if (isEditing) {
                await productsAPI.update(id, productData);
            } else {
                const res = await productsAPI.create(productData);
                productId = res.data.id;
            }

            // Upload new images
            if (images.length > 0) {
                const formDataImages = new FormData();
                images.forEach((file) => {
                    formDataImages.append('files', file);
                });
                await productsAPI.uploadImages(productId, formDataImages);
            }

            navigate('/admin/products');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="page pb-safe-nav">
                <Header title={isEditing ? 'Edit Product' : 'Add Product'} showBack />
                <div className="flex items-center justify-center py-20">
                    <LoadingSpinner size="lg" />
                </div>
            </div>
        );
    }

    return (
        <div className="page pb-safe-nav">
            <Header title={isEditing ? 'Edit Product' : 'Add Product'} showBack />

            <div className="container-app py-6 mt-6">
                <div className="max-w-3xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                <i className="fas fa-exclamation-circle mr-2"></i>
                                {error}
                            </div>
                        )}

                        {/* Basic Info */}
                        <div className="card p-4 space-y-4">
                            <h3 className="font-semibold text-gray-900">Basic Information</h3>

                            <div>
                                <label className="label">Product Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="input min-h-[100px]"
                                />
                            </div>

                            <div>
                                <label className="label">Category *</label>
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="card p-4 space-y-4">
                            <h3 className="font-semibold text-gray-900">Pricing</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Price (KSh) *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="input no-spinners"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Compare Price</label>
                                    <input
                                        type="number"
                                        name="compare_price"
                                        value={formData.compare_price}
                                        onChange={handleChange}
                                        className="input no-spinners"
                                        min="0"
                                        step="0.01"
                                        placeholder="Original price"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        className="input no-spinners"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="card p-4 space-y-4">
                            <h3 className="font-semibold text-gray-900">Details</h3>

                            <div>
                                <label className="label">Dimensions</label>
                                <input
                                    type="text"
                                    name="dimensions"
                                    value={formData.dimensions}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="e.g., 200x90x85 cm"
                                />
                            </div>

                            <div>
                                <label className="label">Material</label>
                                <input
                                    type="text"
                                    name="material"
                                    value={formData.material}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="e.g., Genuine Leather"
                                />
                            </div>

                            <div>
                                <label className="label">Colors (comma separated)</label>
                                <input
                                    type="text"
                                    name="colors"
                                    value={formData.colors}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="e.g., Brown, Black, Grey"
                                />
                            </div>
                        </div>

                        {/* Images */}
                        <div className="card p-4 space-y-4">
                            <h3 className="font-semibold text-gray-900">Images</h3>

                            {existingImages.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                    {existingImages.map((img, index) => (
                                        <div key={index} className="relative w-20 h-20">
                                            <img
                                                src={`${API_HOST}${img} `}
                                                alt=""
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setExistingImages(existingImages.filter((_, i) => i !== index))}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs"
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div>
                                <label className="label">Add New Images</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="input"
                                />
                            </div>
                        </div>

                        {/* Featured Toggle */}
                        <div className="card p-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-primary-600 rounded"
                                />
                                <div>
                                    <span className="font-medium text-gray-900">Featured Product</span>
                                    <p className="text-sm text-gray-500">Show on homepage</p>
                                </div>
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary w-full btn-lg"
                        >
                            {saving ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save"></i>
                                    {isEditing ? 'Update Product' : 'Create Product'}
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
