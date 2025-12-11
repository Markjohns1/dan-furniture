/**
 * Dan Classic Furniture - Header Component
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Sidebar from './Sidebar';

export default function Header({ title, showBack = false, showMenu = true }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { isAuthenticated, isAdmin } = useAuth();
    const { itemCount } = useCart();
    const navigate = useNavigate();

    return (
        <>
            <header className="page-header">
                <div className="container-app">
                    <div className="flex items-center justify-between h-14">
                        {/* Left Side */}
                        <div className="flex items-center gap-3">
                            {showBack ? (
                                <button
                                    onClick={() => navigate(-1)}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    <i className="fas fa-arrow-left"></i>
                                </button>
                            ) : showMenu ? (
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 transition-colors lg:hidden"
                                >
                                    <i className="fas fa-bars"></i>
                                </button>
                            ) : null}

                            {title ? (
                                <h1 className="text-lg font-semibold text-gray-900 truncate">{title}</h1>
                            ) : (
                                <Link to="/" className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-couch text-white text-sm"></i>
                                    </div>
                                    <span className="font-display font-bold text-gray-900 hidden sm:block">
                                        Dan Classic
                                    </span>
                                </Link>
                            )}
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-2">
                            {/* Search Button */}
                            <Link
                                to="/products?search=true"
                                className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                <i className="fas fa-search"></i>
                            </Link>

                            {/* Cart (only for customers) */}
                            {!isAdmin && (
                                <Link
                                    to="/cart"
                                    className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 transition-colors relative"
                                >
                                    <i className="fas fa-shopping-cart"></i>
                                    {itemCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                            {itemCount > 99 ? '99+' : itemCount}
                                        </span>
                                    )}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
    );
}
