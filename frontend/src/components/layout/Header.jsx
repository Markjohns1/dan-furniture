/**
 * Touch Wood - Responsive Header with Desktop Nav
 * Premium UI/UX Design
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
    const [scrolled, setScrolled] = useState(false);

    // Track scroll for header styling
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileMenuOpen]);

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
            <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/98 backdrop-blur-xl shadow-lg shadow-black/[0.03] border-b border-gray-100'
                : 'bg-white/95 backdrop-blur-md border-b border-gray-100/50'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Left: Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="flex items-center py-2 group">
                                <div className="flex items-center gap-2 sm:gap-2.5">
                                    <div className="w-9 h-9 sm:w-11 sm:h-11 bg-primary-950 rounded-lg flex items-center justify-center shadow-lg">
                                        <span className="text-amber-500 font-display font-black text-base sm:text-lg tracking-tighter">TW</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-lg sm:text-xl font-display font-black tracking-tight text-primary-950 leading-none">TOUCH</span>
                                        <span className="text-lg sm:text-xl font-display font-black tracking-tight text-amber-600 leading-none">WOOD</span>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Center: Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-2">
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) =>
                                    `px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${isActive
                                        ? 'bg-primary-950 text-white shadow-lg shadow-primary-950/20'
                                        : 'text-secondary-600 hover:text-primary-900 hover:bg-primary-50'
                                    }`
                                }
                            >
                                Home
                            </NavLink>

                            {/* Hoverable Products Dropdown */}
                            <div className="relative group px-1">
                                <div
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-default ${location.pathname.startsWith('/products')
                                        ? 'bg-primary-950 text-white shadow-lg shadow-primary-950/20'
                                        : 'text-secondary-600 hover:text-primary-900 hover:bg-primary-50'
                                        }`}
                                >
                                    Products
                                    <i className="fas fa-chevron-down text-[9px] opacity-60 group-hover:rotate-180 transition-transform duration-300"></i>
                                </div>

                                {/* Dropdown Menu - Enhanced */}
                                <div className="absolute left-0 top-full pt-3 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                                    <div className="w-64 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 py-2 overflow-hidden">
                                        <div className="px-5 py-3 border-b border-gray-50">
                                            <p className="text-[10px] font-black text-secondary-500 uppercase tracking-widest">Categories</p>
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto py-2">
                                            <Link
                                                to="/products"
                                                className="flex items-center justify-between px-5 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-all group/item"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center group-hover/item:bg-primary-200 transition-colors">
                                                        <i className="fas fa-th-large text-primary-600 text-xs"></i>
                                                    </div>
                                                    <span className="font-semibold">All Collections</span>
                                                </div>
                                                <i className="fas fa-arrow-right text-[10px] opacity-0 group-hover/item:opacity-100 transition-opacity"></i>
                                            </Link>

                                            {categories.map((cat) => (
                                                <Link
                                                    key={cat.id}
                                                    to={`/products?category=${cat.slug}`}
                                                    className="flex items-center justify-between px-5 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-all group/item"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover/item:bg-primary-100 transition-colors">
                                                            <i className="fas fa-folder text-gray-500 group-hover/item:text-primary-600 text-xs transition-colors"></i>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold">{cat.name}</span>
                                                            {cat.product_count > 0 && (
                                                                <span className="text-[10px] text-gray-400">{cat.product_count} items</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <i className="fas fa-arrow-right text-[10px] opacity-0 group-hover/item:opacity-100 transition-opacity"></i>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <NavLink
                                to="/contact"
                                className={({ isActive }) =>
                                    `px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${isActive
                                        ? 'bg-primary-950 text-white shadow-lg shadow-primary-950/20'
                                        : 'text-secondary-600 hover:text-primary-900 hover:bg-primary-50'
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
                                            `px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${isActive
                                                ? 'bg-primary-950 text-white shadow-lg shadow-primary-950/20'
                                                : 'text-secondary-600 hover:text-primary-900 hover:bg-primary-50'
                                            }`
                                        }
                                    >
                                        Dashboard
                                    </NavLink>
                                </>
                            )}
                        </nav>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2">
                            {/* Search - Desktop */}
                            <div className="hidden sm:block relative">
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
                                        className="w-44 lg:w-56 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 focus:w-72 lg:focus:w-80 focus:bg-white transition-all duration-300"
                                    />
                                    <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-600 transition-colors text-sm"></i>
                                </form>
                            </div>

                            {/* Search Icon - Mobile */}
                            <Link
                                to="/products"
                                className="sm:hidden p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <i className="fas fa-search text-lg"></i>
                            </Link>

                            {/* Cart - Enhanced */}
                            {!isAdmin && (
                                <button
                                    onClick={openCart}
                                    className="relative p-2.5 text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-all duration-200"
                                >
                                    <i className="fas fa-shopping-bag text-lg"></i>
                                    <span className={`absolute -top-0.5 -right-0.5 min-w-[20px] h-[20px] px-1.5 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-all transform ${itemCount === 0
                                        ? 'bg-gray-400 scale-90'
                                        : 'bg-gradient-to-br from-orange-500 to-red-500 scale-100'
                                        }`}>
                                        {itemCount > 9 ? '9+' : itemCount}
                                    </span>
                                </button>
                            )}

                            {/* User Profile - Desktop Enhanced */}
                            <div className="hidden lg:flex items-center gap-2 ml-2 border-l border-gray-200 pl-4">
                                {isAuthenticated ? (
                                    <div className="relative group">
                                        <button className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                                            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-md">
                                                <span className="text-white font-bold text-sm">
                                                    {user?.full_name?.charAt(0)?.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="text-left">
                                                <span className="font-semibold text-gray-800 text-sm block max-w-[100px] truncate">
                                                    {user?.full_name?.split(' ')[0]}
                                                </span>
                                                <span className="text-[10px] text-gray-500">View Profile</span>
                                            </div>
                                            <i className="fas fa-chevron-down text-[9px] text-gray-400"></i>
                                        </button>

                                        {/* Dropdown */}
                                        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <i className="fas fa-user text-gray-600 text-sm"></i>
                                                </div>
                                                <span className="font-medium">My Profile</span>
                                            </Link>
                                            {!isAdmin && (
                                                <Link to="/orders" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                        <i className="fas fa-box text-gray-600 text-sm"></i>
                                                    </div>
                                                    <span className="font-medium">My Orders</span>
                                                </Link>
                                            )}
                                            <hr className="my-2 border-gray-100" />
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full transition-colors"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                                                    <i className="fas fa-sign-out-alt text-red-500 text-sm"></i>
                                                </div>
                                                <span className="font-medium">Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-all"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="btn-primary py-2.5 px-5 text-sm shadow-md"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Mobile Menu Button - Enhanced */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Drawer - Premium Design */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-[9999]">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <aside className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white shadow-2xl animate-slide-right flex flex-col">
                        <div className="pt-safe border-b border-gray-100 flex-shrink-0">
                            <div className="px-6 py-5 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-10 h-10 bg-primary-950 rounded-md flex items-center justify-center shadow-md">
                                        <span className="text-amber-500 font-display font-black text-sm tracking-tighter">TW</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-display font-black tracking-tight text-primary-950 leading-none">TOUCH</span>
                                        <span className="text-sm font-display font-black tracking-tight text-amber-600 leading-none">WOOD</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                                >
                                    <i className="fas fa-times text-lg"></i>
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <div className="px-5 py-6">
                                <nav className="space-y-2">
                                    <Link
                                        to="/"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center p-3.5 rounded-xl transition-all ${location.pathname === '/'
                                            ? 'bg-primary-950 text-white shadow-lg'
                                            : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${location.pathname === '/'
                                            ? 'bg-white/20'
                                            : 'bg-primary-100 text-primary-700'
                                            }`}>
                                            <i className="fas fa-home text-sm"></i>
                                        </div>
                                        <span className="text-base font-bold">Home</span>
                                    </Link>

                                    <Link
                                        to="/products"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center p-3.5 rounded-xl transition-all ${location.pathname.startsWith('/products')
                                            ? 'bg-primary-950 text-white shadow-lg'
                                            : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${location.pathname.startsWith('/products')
                                            ? 'bg-white/20'
                                            : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            <i className="fas fa-couch text-sm"></i>
                                        </div>
                                        <span className="text-base font-bold">Shop Furniture</span>
                                    </Link>

                                    {/* Collections Accordion */}
                                    <div className="pt-2">
                                        <button
                                            onClick={() => setCollectionsOpen(!collectionsOpen)}
                                            className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${collectionsOpen
                                                ? 'bg-gradient-to-r from-primary-950 to-primary-900 text-white shadow-xl'
                                                : 'bg-gray-50 text-primary-950 hover:bg-gray-100'
                                                }`}
                                        >
                                            <div className="flex items-center">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${collectionsOpen ? 'bg-white/20' : 'bg-primary-200'
                                                    }`}>
                                                    <i className="fas fa-th-large text-sm"></i>
                                                </div>
                                                <span className="text-base font-bold">Collections</span>
                                            </div>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${collectionsOpen ? 'bg-white/10 rotate-180' : 'bg-gray-200'
                                                }`}>
                                                <i className={`fas fa-chevron-down text-[10px] ${collectionsOpen ? 'text-white' : 'text-gray-500'}`}></i>
                                            </div>
                                        </button>

                                        <div className={`grid grid-cols-1 gap-1.5 overflow-hidden transition-all duration-400 ease-out ${collectionsOpen ? 'max-h-[600px] opacity-100 mt-3' : 'max-h-0 opacity-0'
                                            }`}>
                                            {categories && categories.length > 0 ? categories.map(cat => (
                                                <Link
                                                    key={cat.id}
                                                    to={`/products?category=${cat.slug}`}
                                                    onClick={() => {
                                                        setMobileMenuOpen(false);
                                                        setCollectionsOpen(false);
                                                    }}
                                                    className="flex items-center justify-between ml-3 px-5 py-3.5 rounded-xl hover:bg-primary-50 transition-all bg-white border border-gray-100 group active:scale-[0.98]"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 rounded-full bg-primary-300 group-hover:bg-primary-600 transition-colors"></div>
                                                        <span className="text-sm font-bold text-gray-800 capitalize">{cat.name}</span>
                                                    </div>
                                                    <i className="fas fa-arrow-right text-[10px] text-primary-600 opacity-0 group-hover:opacity-100 transition-all"></i>
                                                </Link>
                                            )) : (
                                                <p className="text-sm text-gray-500 italic p-4 text-center">Loading styles...</p>
                                            )}
                                        </div>
                                    </div>

                                    <Link
                                        to="/contact"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center p-3.5 rounded-xl hover:bg-gray-50 transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mr-4">
                                            <i className="fas fa-envelope text-sm"></i>
                                        </div>
                                        <span className="text-base font-bold text-gray-800">Contact Us</span>
                                    </Link>
                                </nav>
                            </div>

                            {/* User Section */}
                            <div className="p-5 border-t border-gray-100 bg-gray-50">
                                {isAuthenticated ? (
                                    <Link
                                        to="/profile"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-4 py-3 px-4 bg-white rounded-2xl border border-gray-200 shadow-sm"
                                    >
                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center font-bold shadow-md">
                                            {user.full_name?.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 text-sm truncate">{user.full_name}</p>
                                            <p className="text-[10px] text-primary-600 font-bold uppercase tracking-wider">View Profile →</p>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3">
                                        <Link
                                            to="/register"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full py-3.5 bg-gradient-to-r from-primary-950 to-primary-900 text-white font-bold rounded-xl text-center shadow-lg text-sm"
                                        >
                                            Create Account
                                        </Link>
                                        <Link
                                            to="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full py-3 border-2 border-gray-200 text-gray-900 font-bold rounded-xl text-center bg-white text-sm hover:bg-gray-50 transition-colors"
                                        >
                                            Sign In
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
}
