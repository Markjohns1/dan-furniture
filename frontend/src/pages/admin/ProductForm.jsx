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
    const [aiProcessing, setAiProcessing] = useState(false);
    const [showFullForm, setShowFullForm] = useState(isEditing);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        compare_price: '',
        category_id: '',
        stock: '100',
        dimensions: '',
        material: '',
        colors: '',
        featured: false,
    });
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
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
        const files = Array.from(e.target.files);
        setImages(files);

        // Generate previews
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);

        // Auto-show the Magic Button if we were hidden
        if (!showFullForm) {
            setError('');
        }
    };

    const handleAIGenerate = async () => {
        if (images.length === 0 && existingImages.length === 0) {
            setError('Please upload a photo first');
            return;
        }

        setAiProcessing(true);
        setError('');

        // Simulation of Groq Vision API - Upgraded for multi-product intelligence
        setTimeout(() => {
            const fileName = images[0]?.name.toLowerCase() || '';
            let name = '';
            let desc = '';
            let catId = categories[0]?.id || '';
            let price = '45000';
            let mat = 'Premium Materials';
            let dim = 'Standard Size';
            let colors = 'Grey, Beige, White';

            // 1. Detection Logic for Appliances (New!)
            if (fileName.includes('fridge') || fileName.includes('refrigerator')) {
                name = 'Double-Door Smart Cooling Refrigerator';
                desc = 'Keep your food fresh for longer with this energy-efficient smart refrigerator. Features multi-flow air cooling, tempered glass shelves, and a dedicated moisture-controlled crisper drawer.';
                catId = categories.find(c => c.name.toLowerCase().includes('appliances'))?.id || catId;
                price = '85000';
                mat = 'Stainless Steel Finish';
                dim = '180 x 70 x 65 cm';
                colors = 'Silver, Black, Metallic';
            } else if (fileName.includes('wash') || fileName.includes('machine')) {
                name = 'High-Performance Front Load Washing Machine';
                desc = 'Experience a deeper clean with low water consumption. This 8kg capacity washer features advanced drum technology for gentle fabric care and high-speed spin for faster drying.';
                catId = categories.find(c => c.name.toLowerCase().includes('appliances'))?.id || catId;
                price = '65000';
                mat = 'Enameled Steel & Glass';
                dim = '85 x 60 x 55 cm';
                colors = 'White, Graphite';
            }
            // 2. Enhanced Logic for Furniture
            else if (fileName.includes('sofa') || fileName.includes('couch') || fileName.includes('sectional')) {
                const types = ['Velvet Sectional', 'Luxury Chesterfield', 'Modern Fabric'];
                const selected = types[Math.floor(Math.random() * types.length)];
                name = `${selected} Sofaset`;
                desc = `Transform your living space with this ${selected.toLowerCase()} masterpiece. Hand-tufted details and high-density foam seating provide both elegance and supreme comfort for your family.`;
                catId = categories.find(c => c.slug === 'sofasets')?.id || catId;
                price = '135000';
                mat = 'Stain-Resistant Performance Fabric';
                dim = '240 x 100 x 90 cm';
                colors = 'Navy, Charcoal, Cream';
            } else if (fileName.includes('chair') || fileName.includes('stool')) {
                name = 'Ergonomic Executive Office Chair';
                desc = 'Designed for productivity and joint health. Features breathable mesh support, adjustable armrests, and a 360-degree silent swivel base for professional workspaces.';
                catId = categories.find(c => c.slug === 'office-chairs' || c.slug === 'chairs')?.id || catId;
                price = '22500';
                mat = 'Breathable Mesh & High-Quality Polymer';
                dim = '65 x 60 x 120 cm';
                colors = 'Black, Space Grey';
            } else if (fileName.includes('table') || fileName.includes('dining')) {
                name = 'Contemporary 6-Seater Oak Dining Table';
                desc = 'The centerpiece of every memorable meal. Crafted from sustainably sourced solid oak with a smooth, scratch-resistant finish that highlights the natural beauty of the wood grain.';
                catId = categories.find(c => c.slug === 'dining-sets')?.id || catId;
                price = '95000';
                mat = 'Solid Oak & Natural Oil Finish';
                dim = '180 x 90 x 75 cm';
                colors = 'Natural Oak, Walnut, Teak';
            } else if (fileName.includes('bed') || fileName.includes('bedroom')) {
                name = 'Royal King Size Upholstered Bed';
                desc = 'Sleep like royalty on this magnificently designed bed frame. Features a floor-to-ceiling padded headboard and a reinforced steel support system for ultimate stability.';
                catId = categories.find(c => c.name.toLowerCase().includes('bed'))?.id || catId;
                price = '110000';
                mat = 'Velvet Fabric & Solid Mahogany';
                dim = '210 x 190 x 140 cm';
                colors = 'Emerald, Midnight Blue, Grey';
            }
            // 3. Fallback - Much more professional than "Masterpiece"
            else {
                name = 'Dan Classic Private Collection Piece';
                desc = 'A bespoke addition to your home environment. This item represents the height of craftsmanship, featuring hand-selected materials and a design that prioritizes both aesthetics and functionality.';
                catId = categories[0]?.id || '';
                price = '49500';
            }

            setFormData({
                ...formData,
                name: name,
                description: desc,
                category_id: String(catId),
                price: price,
                material: mat,
                dimensions: dim,
                colors: colors
            });

            setShowFullForm(true);
            setAiProcessing(false);
        }, 2200); // 2.2s speed factor
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
                    {/* Header Step Indicator */}
                    {!isEditing && (
                        <div className="flex justify-between items-center mb-8 px-4">
                            <div className={`flex flex-col items-center flex-1 relative ${!showFullForm ? 'text-primary-600' : 'text-gray-400'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 font-bold ${!showFullForm ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-gray-200 text-gray-500'}`}>1</div>
                                <span className="text-xs uppercase tracking-wider font-bold">Upload Photo</span>
                                <div className="absolute top-5 -right-1/2 w-full h-[2px] bg-gray-100 -z-10"></div>
                            </div>
                            <div className={`flex flex-col items-center flex-1 ${showFullForm ? 'text-primary-600' : 'text-gray-400'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 font-bold ${showFullForm ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-gray-200 text-gray-500'}`}>2</div>
                                <span className="text-xs uppercase tracking-wider font-bold">Review & Save</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                                <i className="fas fa-exclamation-circle text-lg"></i>
                                {error}
                            </div>
                        )}

                        {/* STEP 1: Image Upload & AI Magic */}
                        <div className={`card p-6 overflow-hidden transition-all duration-500 ${!showFullForm ? 'border-2 border-dashed border-primary-200' : ''}`}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <i className="fas fa-camera text-primary-500"></i>
                                    Product Photo
                                </h3>
                                {images.length > 0 && !showFullForm && (
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase">Photo Ready</span>
                                )}
                            </div>

                            <div className="space-y-4">
                                {(existingImages.length > 0 || imagePreviews.length > 0) && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {[...existingImages, ...imagePreviews].map((img, index) => (
                                            <div key={index} className="relative aspect-square">
                                                <img
                                                    src={img.startsWith('blob:') ? img : `${API_HOST}${img}`}
                                                    alt=""
                                                    className="w-full h-full object-cover rounded-xl border border-gray-100 shadow-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (index < existingImages.length) {
                                                            setExistingImages(existingImages.filter((_, i) => i !== index));
                                                        } else {
                                                            const previewIdx = index - existingImages.length;
                                                            setImages(images.filter((_, i) => i !== previewIdx));
                                                            setImagePreviews(imagePreviews.filter((_, i) => i !== previewIdx));
                                                        }
                                                    }}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md animate-in zoom-in"
                                                >
                                                    <i className="fas fa-times text-[10px]"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    <div className={`py-12 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl transition-all ${images.length > 0 ? 'border-green-200 bg-green-50/30' : 'border-gray-200 group-hover:border-primary-300 group-hover:bg-primary-50/30'}`}>
                                        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <i className={`fas ${images.length > 0 ? 'fa-plus text-green-500' : 'fa-cloud-arrow-up text-primary-500'} text-2xl`}></i>
                                        </div>
                                        <p className="font-bold text-gray-900">
                                            {images.length > 0 ? 'Add more photos' : 'Tap to upload product photo'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">High quality photos sell faster</p>
                                    </div>
                                </div>

                                {images.length > 0 && !showFullForm && (
                                    <button
                                        type="button"
                                        onClick={handleAIGenerate}
                                        disabled={aiProcessing}
                                        className="w-full py-5 bg-gradient-to-r from-purple-600 to-primary-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary-200 active:scale-95 transition-all text-lg"
                                    >
                                        {aiProcessing ? (
                                            <>
                                                <i className="fas fa-sparkles fa-spin text-xl"></i>
                                                <span>SCANNING & UPLOADING...</span>
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-wand-magic-sparkles text-xl"></i>
                                                <span>AI MAGIC LISTING (FAST)</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* STEP 2: Full Form (Initially hidden) */}
                        <div className={`space-y-6 transition-all duration-700 origin-top ${showFullForm ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none h-0 overflow-hidden'}`}>

                            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm shrink-0">
                                    <i className="fas fa-check-double animate-bounce"></i>
                                </div>
                                <div>
                                    <p className="font-bold text-purple-900 text-sm">AI Listing Ready!</p>
                                    <p className="text-xs text-purple-700">Preview details and click Save below.</p>
                                </div>
                            </div>

                            {/* Basic Info */}
                            <div className="card p-4 space-y-4">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <i className="fas fa-info-circle text-primary-500"></i>
                                    Details
                                </h3>

                                <div>
                                    <label className="label">Product Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input bg-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="input min-h-[120px] bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="label">Category *</label>
                                    <select
                                        name="category_id"
                                        value={formData.category_id}
                                        onChange={handleChange}
                                        className="input bg-white"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Pricing & Stock */}
                            <div className="card p-4 space-y-4">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <i className="fas fa-tag text-primary-500"></i>
                                    Pricing
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Price (KSh) *</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            className="input no-spinners bg-white"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Full Stock</label>
                                        <input
                                            type="number"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleChange}
                                            className="input no-spinners bg-white"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Technical Details */}
                            <div className="card p-4 space-y-4">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <i className="fas fa-ruler-combined text-primary-500"></i>
                                    Specifications
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Dimensions</label>
                                        <input
                                            type="text"
                                            name="dimensions"
                                            value={formData.dimensions}
                                            onChange={handleChange}
                                            className="input bg-white"
                                            placeholder="200x90x85 cm"
                                        />
                                    </div>

                                    <div>
                                        <label className="label">Material</label>
                                        <input
                                            type="text"
                                            name="material"
                                            value={formData.material}
                                            onChange={handleChange}
                                            className="input bg-white"
                                            placeholder="Genuine Leather"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Colors (comma separated)</label>
                                    <input
                                        type="text"
                                        name="colors"
                                        value={formData.colors}
                                        onChange={handleChange}
                                        className="input bg-white"
                                        placeholder="Brown, Black, Grey"
                                    />
                                </div>
                            </div>

                            {/* Featured Toggle */}
                            <div className="card p-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            checked={formData.featured}
                                            onChange={handleChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                    </div>
                                    <div>
                                        <span className="font-bold text-gray-900">Featured</span>
                                        <p className="text-xs text-gray-500">Highlight on store home</p>
                                    </div>
                                </label>
                            </div>

                            <div className="flex gap-4 pt-4 pb-12">
                                <button
                                    type="button"
                                    onClick={() => setShowFullForm(false)}
                                    className="btn-secondary flex-1 py-4 font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="btn-primary flex-[2] py-4 bg-primary-700 shadow-xl shadow-primary-100 font-bold flex items-center justify-center gap-3"
                                >
                                    {saving ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin"></i>
                                            SAVING...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-check-circle"></i>
                                            {isEditing ? 'UPDATE LISTING' : 'PUBLISH LISTING'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
