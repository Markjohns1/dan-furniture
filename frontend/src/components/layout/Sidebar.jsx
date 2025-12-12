/**
 * Dan Classic Furniture - Sidebar Navigation
 */
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const location = useLocation();

    const menuItems = [
        { to: '/', icon: 'fa-home', label: 'Home' },
        { to: '/products', icon: 'fa-th-large', label: 'All Products' },
        { divider: true, label: 'Categories' },
        { to: '/products?category=sofasets', icon: 'fa-couch', label: 'Sofasets' },
        { to: '/products?category=chairs', icon: 'fa-chair', label: 'Chairs' },
        { to: '/products?category=dining-sets', icon: 'fa-utensils', label: 'Dining Sets' },
        { to: '/products?category=office-chairs', icon: 'fa-briefcase', label: 'Office Chairs' },
        { divider: true, label: 'Account' },
    ];

    const handleLogout = () => {
        logout();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="overlay animate-fade-in"
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside className="fixed top-0 left-0 z-50 w-72 h-full bg-white shadow-xl animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                            <i className="fas fa-couch text-white"></i>
                        </div>
                        <div>
                            <h2 className="font-display font-bold text-gray-900">Dan Classic</h2>
                            <p className="text-xs text-gray-500">Furniture</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* User Info */}
                {isAuthenticated && (
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                <i className="fas fa-user text-primary-600 text-lg"></i>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{user?.full_name}</p>
                                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                                {isAdmin && (
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                                        Admin
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Menu Items */}
                <nav className="p-4 overflow-y-auto h-[calc(100%-200px)]">
                    <ul className="space-y-1">
                        {menuItems.map((item, index) => {
                            if (item.divider) {
                                return (
                                    <li key={index} className="pt-4 pb-2">
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            {item.label}
                                        </span>
                                    </li>
                                );
                            }

                            return (
                                <li key={item.to}>
                                    <Link
                                        to={item.to}
                                        onClick={onClose}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${location.pathname === item.to
                                            ? 'bg-primary-50 text-primary-600'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <i className={`fas ${item.icon} w-5`}></i>
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}

                        {/* Auth Links */}
                        {isAuthenticated ? (
                            <>
                                <li>
                                    <Link
                                        to="/orders"
                                        onClick={onClose}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100"
                                    >
                                        <i className="fas fa-box w-5"></i>
                                        <span className="font-medium">My Orders</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/profile"
                                        onClick={onClose}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100"
                                    >
                                        <i className="fas fa-cog w-5"></i>
                                        <span className="font-medium">Settings</span>
                                    </Link>
                                </li>
                                <li className="pt-2">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 w-full"
                                    >
                                        <i className="fas fa-sign-out-alt w-5"></i>
                                        <span className="font-medium">Logout</span>
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        to="/login"
                                        onClick={onClose}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100"
                                    >
                                        <i className="fas fa-sign-in-alt w-5"></i>
                                        <span className="font-medium">Login</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/register"
                                        onClick={onClose}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-700"
                                    >
                                        <i className="fas fa-user-plus w-5"></i>
                                        <span className="font-medium">Create Account</span>
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-center gap-4 text-gray-400">
                        <a href="https://wa.me/254700000000" className="hover:text-green-500">
                            <i className="fab fa-whatsapp text-xl"></i>
                        </a>
                        <a href="https://instagram.com" className="hover:text-pink-500">
                            <i className="fab fa-instagram text-xl"></i>
                        </a>
                        <a href="tel:+254700000000" className="hover:text-primary-500">
                            <i className="fas fa-phone text-xl"></i>
                        </a>
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-2">
                        © 2024 Dan Classic Furniture
                    </p>
                </div>
            </aside>
        </>
    );
}
