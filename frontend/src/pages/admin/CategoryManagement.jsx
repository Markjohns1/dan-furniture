/**
 * Dan Classic Furniture - Category Management
 * Admin can add, edit, and delete categories with logic checks
 */
import { useState, useEffect } from 'react';
import { categoriesAPI } from '../../api';
import Header from '../../components/layout/Header';
import { LoadingPage } from '../../components/ui/Loading';
import AdminNav from '../../components/admin/AdminNav';

export default function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await categoriesAPI.getAll();
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            if (editingCategory) {
                await categoriesAPI.update(editingCategory.id, formData);
                setMessage('Category updated successfully!');
            } else {
                await categoriesAPI.create(formData);
                setMessage('Category created successfully!');
            }
            setShowForm(false);
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.detail || 'Something went wrong');
        }
    };

    const handleDelete = async (category) => {
        setError('');
        setMessage('');

        if (category.product_count > 0) {
            setError(`Cannot delete "${category.name}" because it contains ${category.product_count} items. Please move these items to another category or wait until they are sold before deleting this category.`);
            return;
        }

        if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
            try {
                await categoriesAPI.delete(category.id);
                setMessage('Category deleted successfully!');
                fetchCategories();
            } catch (err) {
                setError(err.response?.data?.detail || 'Error deleting category');
            }
        }
    };

    const startEdit = (category) => {
        setEditingCategory(category);
        setFormData({ name: category.name, description: category.description || '' });
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    if (loading && categories.length === 0) return <LoadingPage />;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header title="Manage Categories" showBack />

            <AdminNav />

            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                        <p className="text-gray-500">Organize your furniture collection</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingCategory(null);
                            setFormData({ name: '', description: '' });
                            setShowForm(!showForm);
                        }}
                        className="btn-primary"
                    >
                        <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'} mr-2`}></i>
                        {showForm ? 'Cancel' : 'Add Category'}
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-start gap-3 animate-fade-in">
                        <i className="fas fa-exclamation-circle mt-1"></i>
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {message && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl flex items-start gap-3 animate-fade-in">
                        <i className="fas fa-check-circle mt-1"></i>
                        <p className="text-sm font-medium">{message}</p>
                    </div>
                )}

                {showForm && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 animate-slide-down">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">
                            {editingCategory ? 'Edit Category' : 'New Category'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="e.g., Sofasets"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Briefly describe what goes in here..."
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="btn-primary flex-1">
                                    {editingCategory ? 'Save Changes' : 'Create Category'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Category Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Items</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {categories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{cat.name}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{cat.description || 'No description'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cat.product_count > 0 ? 'bg-primary-50 text-primary-700' : 'bg-gray-100 text-gray-400'}`}>
                                                {cat.product_count} products
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => startEdit(cat)}
                                                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                    title="Edit Category"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Category"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {categories.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-gray-400 font-medium">
                                            No categories found. Start by adding one!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
