/**
 * Dan Classic Furniture - Responsive Header with Desktop Nav
 */
import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Header({ title, showBack = false }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { itemCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Logo & Back */}
                    <div className="flex items-center gap-4">
                        {showBack && (
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                            >
                                <i className="fas fa-arrow-left text-lg"></i>
                            </button>
                        )}

                        {title ? (
                            <h1 className="text-lg font-bold text-gray-900 lg:hidden">{title}</h1>
                        ) : null}

                        <Link to="/" className="flex items-center">
                            <img
                                src="/logo.svg"
                                alt="Daniel Furniture"
                                className="h-10 sm:h-12 w-auto"
                            />
                        </Link>
                    </div>

                    {/* Center: Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg font-medium transition-colors ${isActive
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`
                            }
                        >
                            Home
                        </NavLink>

                        {/* Custom NavLink for Products/Categories to handle query params */}
                        {[
                            { to: '/products', label: 'Products', check: (loc) => loc.pathname === '/products' && !loc.search.includes('category=') },
                            { to: '/products?category=sofasets', label: 'Sofasets', check: (loc) => loc.search.includes('category=sofasets') },
                            { to: '/products?category=chairs', label: 'Chairs', check: (loc) => loc.search.includes('category=chairs') },
                        ].map((item) => {
                            const isActive = item.check(location); // using useLocation hook from parent
                            return (
                                <Link
                                    key={item.label}
                                    to={item.to}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${isActive
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}

                        {isAdmin && (
                            <>
                                <NavLink
                                    to="/admin"
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-lg font-medium transition-colors ${isActive
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`
                                    }
                                >
                                    Admin
                                </NavLink>
                                <NavLink
                                    to="/admin/users"
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-lg font-medium transition-colors ${isActive
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`
                                    }
                                >
                                    Users
                                </NavLink>
                            </>
                        )}
                    </nav>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        {/* Search - Desktop */}
                        <Link
                            to="/products?search=true"
                            className="hidden sm:flex p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <i className="fas fa-search text-lg"></i>
                        </Link>

                        {/* Cart */}
                        {!isAdmin && (
                            <Link
                                to="/cart"
                                className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <i className="fas fa-shopping-cart text-lg"></i>
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-cta-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                                        {itemCount > 9 ? '9+' : itemCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* User Menu - Desktop */}
                        <div className="hidden lg:flex items-center gap-2 ml-2">
                            {isAuthenticated ? (
                                <div className="relative group">
                                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                            <i className="fas fa-user text-primary-600 text-sm"></i>
                                        </div>
                                        <span className="font-medium text-gray-700 max-w-[120px] truncate">
                                            {user?.full_name?.split(' ')[0]}
                                        </span>
                                        <i className="fas fa-chevron-down text-xs text-gray-400"></i>
                                    </button>

                                    {/* Dropdown */}
                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                        <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50">
                                            <i className="fas fa-user w-4"></i>
                                            Profile
                                        </Link>
                                        {!isAdmin && (
                                            <Link to="/orders" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50">
                                                <i className="fas fa-box w-4"></i>
                                                My Orders
                                            </Link>
                                        )}
                                        <hr className="my-2 border-gray-100" />
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full"
                                        >
                                            <i className="fas fa-sign-out-alt w-4"></i>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="btn-secondary py-2 px-4 shadow-none border-transparent hover:bg-gray-50"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="btn-primary py-2 px-4 shadow-none"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-100">
                    <div className="px-4 py-3 space-y-1">
                        <Link
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                        >
                            <i className="fas fa-home w-6 text-center text-lg mr-2 text-gray-400"></i>
                            Home
                        </Link>
                        <Link
                            to="/products"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                        >
                            <i className="fas fa-th-large w-6 text-center text-lg mr-2 text-gray-400"></i>
                            All Products
                        </Link>
                        <Link
                            to="/products?category=sofasets"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                        >
                            <i className="fas fa-couch w-6 text-center text-lg mr-2 text-gray-400"></i>
                            Sofasets
                        </Link>
                        <Link
                            to="/products?category=chairs"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                        >
                            <i className="fas fa-chair w-6 text-center text-lg mr-2 text-gray-400"></i>
                            Chairs
                        </Link>

                        <hr className="my-2 border-gray-100" />

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                                >
                                    <i className="fas fa-user w-6 text-center text-lg mr-2 text-gray-400"></i>
                                    Profile
                                </Link>
                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center px-3 py-2 rounded-lg text-primary-600 hover:bg-primary-50 font-medium"
                                    >
                                        <i className="fas fa-cog w-6 text-center text-lg mr-2"></i>
                                        Admin Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                    className="flex items-center w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 font-medium"
                                >
                                    <i className="fas fa-sign-out-alt w-6 text-center text-lg mr-2"></i>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-2 pt-2">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex-1 text-center px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex-1 text-center px-4 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
