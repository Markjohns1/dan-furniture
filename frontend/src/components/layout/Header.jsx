/**
 * Dan Classic Furniture - Responsive Header with Desktop Nav
 */
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { categoriesAPI } from '../../api';

export default function Header({ title, showBack = false }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { itemCount, openCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [collectionsOpen, setCollectionsOpen] = useState(false);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileMenuOpen]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        setLoadingCategories(true);
        categoriesAPI.getAll()
            .then(res => setCategories(res.data))
            .catch(err => console.error("Error fetching categories:", err))
            .finally(() => setLoadingCategories(false));
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-[0.5px] border-[#000080] transition-all duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Left: Logo & Back */}
                        {/* Left: Logo - Protected & Non-Interfering */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="flex items-center py-2">
                                <img
                                    src="/logo.svg"
                                    alt="Daniel Furniture"
                                    className="h-14 sm:h-16 w-auto object-contain transition-all"
                                />
                            </Link>
                        </div>

                        {/* Center: Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-8">
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-lg font-medium transition-colors ${isActive
                                        ? 'bg-primary-950 text-white shadow-lg shadow-primary-900/20'
                                        : 'text-gray-500 hover:text-primary-900 hover:bg-gray-50'
                                    }`
                                }
                            >
                                Home
                            </NavLink>

                            {/* Hoverable Products Dropdown */}
                            <div className="relative group px-1">
                                <div
                                    className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors cursor-default ${location.pathname.startsWith('/products')
                                        ? 'bg-primary-950 text-white shadow-lg shadow-primary-900/20'
                                        : 'text-gray-500 hover:text-primary-900 hover:bg-gray-50'
                                        }`}
                                >
                                    Products
                                    <i className="fas fa-chevron-down text-[10px] opacity-50 group-hover:rotate-180 transition-transform duration-200"></i>
                                </div>

                                {/* Dropdown Menu */}
                                <div className="absolute left-0 top-full pt-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                                    <div className="w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-3 overflow-hidden">
                                        <div className="px-4 py-2 border-b border-gray-50">
                                            <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Categories</p>
                                        </div>
                                        <div className="max-h-[350px] overflow-y-auto">
                                            <Link
                                                to="/products"
                                                className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                                            >
                                                <span className="font-medium">All Collections</span>
                                                <i className="fas fa-chevron-right text-[10px] opacity-30"></i>
                                            </Link>

                                            {categories.map((cat) => (
                                                <Link
                                                    key={cat.id}
                                                    to={`/products?category=${cat.slug}`}
                                                    className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{cat.name}</span>
                                                        {cat.product_count > 0 && (
                                                            <span className="text-[10px] text-gray-400">{cat.product_count} items</span>
                                                        )}
                                                    </div>
                                                    <i className="fas fa-chevron-right text-[10px] opacity-30"></i>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <NavLink
                                to="/contact"
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-lg font-medium transition-colors ${isActive
                                        ? 'bg-primary-950 text-white shadow-lg shadow-primary-900/20'
                                        : 'text-gray-500 hover:text-primary-900 hover:bg-gray-50'
                                    }`
                                }
                            >
                                Contact
                            </NavLink>

                            {isAdmin && (
                                <>
                                    <NavLink
                                        to="/admin"
                                        className={({ isActive }) =>
                                            `px-4 py-2 rounded-lg font-medium transition-colors ${isActive
                                                ? 'bg-primary-950 text-white shadow-lg shadow-primary-900/20'
                                                : 'text-gray-500 hover:text-primary-900 hover:bg-gray-50'
                                            }`
                                        }
                                    >
                                        Admin
                                    </NavLink>
                                    <NavLink
                                        to="/admin/users"
                                        className={({ isActive }) =>
                                            `px-4 py-2 rounded-lg font-medium transition-colors ${isActive
                                                ? 'bg-primary-950 text-white shadow-lg shadow-primary-900/20'
                                                : 'text-gray-500 hover:text-primary-900 hover:bg-gray-50'
                                            }`
                                        }
                                    >
                                        Users
                                    </NavLink>
                                </>
                            )}
                        </nav>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            {/* Improved Search - Desktop */}
                            <div className="hidden sm:block relative mr-2">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const query = e.target.search.value;
                                        if (query) navigate(`/products?search=${query}`);
                                    }}
                                    className="relative group"
                                >
                                    <input
                                        type="text"
                                        name="search"
                                        placeholder="Search furniture..."
                                        className="w-48 lg:w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:w-80 lg:focus:w-96 transition-all duration-300"
                                    />
                                    <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors"></i>
                                </form>
                            </div>

                            {/* Search Icon - Mobile */}
                            <Link
                                to="/products"
                                className="sm:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg"
                            >
                                <i className="fas fa-search text-lg"></i>
                            </Link>

                            {/* Cart */}
                            {!isAdmin && (
                                <button
                                    onClick={openCart}
                                    className="relative p-2.5 text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-full transition-all duration-200"
                                >
                                    <i className="fas fa-shopping-bag text-lg"></i>
                                    <span className={`absolute top-1 right-1 min-w-[18px] h-[18px] px-1 text-white text-[9px] font-semibold rounded-full flex items-center justify-center shadow-md border-2 border-white transition-all transform ${itemCount === 0
                                        ? 'bg-red-500 scale-90 opacity-90'
                                        : 'bg-cta-600 scale-110'
                                        }`}>
                                        {itemCount > 9 ? '9+' : itemCount}
                                    </span>
                                </button>
                            )}

                            {/* User Profile - Desktop */}
                            <div className="hidden lg:flex items-center gap-1 ml-1 border-l border-gray-100 pl-4">
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
            </header>

            {/* Global Mobile Drawer */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-[9999]">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <aside className="fixed inset-y-0 left-0 w-[85%] max-w-xs bg-white shadow-2xl animate-slide-right flex flex-col">
                        <div className="pt-safe border-b border-gray-100 flex-shrink-0">
                            <div className="px-6 py-6 flex items-center justify-between">
                                <img src="/logo.svg" alt="Daniel Furniture" className="h-12 w-auto object-contain" />
                                <button onClick={() => setMobileMenuOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-950">
                                    <i className="fas fa-times text-lg"></i>
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <div className="px-6 py-6">
                                <nav className="space-y-5">
                                    <div className="space-y-2">
                                        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center p-3 rounded-xl hover:bg-gray-50 bg-gray-50/50">
                                            <div className="w-10 h-10 rounded-lg bg-primary-600 text-white flex items-center justify-center mr-4"><i className="fas fa-home text-sm"></i></div>
                                            <span className="text-lg font-bold text-gray-950">Home Page</span>
                                        </Link>
                                        <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="flex items-center p-3 rounded-xl hover:bg-gray-50">
                                            <div className="w-10 h-10 rounded-lg bg-gray-200 text-gray-700 flex items-center justify-center mr-4"><i className="fas fa-couch text-sm"></i></div>
                                            <span className="text-lg font-bold text-gray-950">Shop Furniture</span>
                                        </Link>
                                    </div>

                                    <div className="pt-2 space-y-3">
                                        <button
                                            onClick={() => setCollectionsOpen(!collectionsOpen)}
                                            className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 border-2 ${collectionsOpen
                                                ? 'bg-primary-950 border-primary-950 text-white shadow-xl ring-4 ring-primary-50'
                                                : 'bg-white border-gray-100 text-primary-950 hover:border-primary-100 shadow-sm'
                                                }`}
                                        >
                                            <div className="flex items-center">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 shadow-md transition-colors ${collectionsOpen ? 'bg-white/20 text-white' : 'bg-primary-900 text-white'
                                                    }`}>
                                                    <i className="fas fa-th-large text-sm"></i>
                                                </div>
                                                <span className="text-lg font-bold tracking-tight">Collections</span>
                                            </div>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${collectionsOpen ? 'bg-white/10 rotate-180' : 'bg-gray-50'}`}>
                                                <i className={`fas fa-chevron-down text-[10px] ${collectionsOpen ? 'text-white' : 'text-gray-400'}`}></i>
                                            </div>
                                        </button>

                                        <div className={`grid grid-cols-1 gap-2 overflow-hidden transition-all duration-500 ease-out ${collectionsOpen ? 'max-h-[1000px] opacity-100 mt-2' : 'max-h-0 opacity-0 invisible'}`}>
                                            {categories && categories.length > 0 ? categories.map(cat => (
                                                <Link
                                                    key={cat.id}
                                                    to={`/products?category=${cat.slug}`}
                                                    onClick={() => {
                                                        setMobileMenuOpen(false);
                                                        setCollectionsOpen(false);
                                                    }}
                                                    className="flex items-center justify-between ml-2 px-6 py-4 rounded-xl hover:bg-primary-50 transition-all bg-white border border-gray-50 hover:border-primary-100 group shadow-sm active:scale-[0.98]"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-200 group-hover:bg-primary-600 transition-colors"></div>
                                                        <span className="text-[15px] font-bold text-gray-950 capitalize tracking-tight">{cat.name}</span>
                                                    </div>
                                                    <i className="fas fa-arrow-right text-[10px] text-primary-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"></i>
                                                </Link>
                                            )) : <p className="text-sm text-gray-500 italic p-4 text-center">Loading styles...</p>}
                                        </div>
                                    </div>
                                </nav>
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-white">
                                {isAuthenticated ? (
                                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 py-3 px-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">{user.full_name?.charAt(0)}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 text-sm truncate">{user.full_name}</p>
                                            <p className="text-[9px] text-primary-600 font-bold uppercase tracking-wider">View Profile</p>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="grid grid-cols-1 gap-2.5">
                                        <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full py-3.5 bg-primary-950 text-white font-bold rounded-xl text-center shadow-lg text-sm">Create Account</Link>
                                        <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 border border-gray-200 text-gray-900 font-bold rounded-xl text-center bg-white text-sm">Sign In</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside >
                </div >
            )
            }
        </>
    );
}
