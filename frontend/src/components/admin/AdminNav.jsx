/**
 * Dan Classic Furniture - Admin Navigation Component
 * Sticky sub-navigation for admin pages
 */
import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminNav() {
    const location = useLocation();
    const scrollRef = useRef(null);
    const isActive = (path) => location.pathname === path;

    // Mobile Scroll Hint Animation
    useEffect(() => {
        // Only run on mobile/tablet
        if (window.innerWidth < 1024) {
            const timer = setTimeout(() => {
                if (scrollRef.current) {
                    // Smoothly scroll right then back left to hint overflow
                    scrollRef.current.scrollTo({ left: 60, behavior: 'smooth' });

                    setTimeout(() => {
                        if (scrollRef.current) {
                            scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                        }
                    }, 800);
                }
            }, 1000); // Wait 1s after load

            return () => clearTimeout(timer);
        }
    }, [location.pathname]); // Run on route change too

    return (
        <div
            ref={scrollRef}
            className="sticky top-20 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 overflow-x-auto no-scrollbar transition-all duration-300"
        >
            <div className="container-app flex items-center gap-2 py-3 min-w-max">
                <Link to="/" className="btn btn-sm bg-gray-900 text-white shadow-lg hover:bg-gray-800 border-2 border-transparent">
                    <i className="fas fa-external-link-alt mr-2"></i>View Shop
                </Link>
                <div className="w-px h-6 bg-gray-200 mx-2"></div>

                <Link
                    to="/admin"
                    className={`btn btn-sm border ${isActive('/admin') ? 'bg-primary-50 text-primary-900 border-primary-100 font-bold' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                >
                    <i className="fas fa-chart-pie mr-2"></i>Dashboard
                </Link>

                <Link
                    to="/admin/orders"
                    className={`btn btn-sm border ${isActive('/admin/orders') ? 'bg-primary-50 text-primary-900 border-primary-100 font-bold' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                >
                    <i className="fas fa-shopping-bag mr-2"></i>Orders
                </Link>

                <Link
                    to="/admin/products"
                    className={`btn btn-sm border ${isActive('/admin/products') ? 'bg-primary-50 text-primary-900 border-primary-100 font-bold' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                >
                    <i className="fas fa-couch mr-2"></i>Products
                </Link>

                <Link
                    to="/admin/categories"
                    className={`btn btn-sm border ${isActive('/admin/categories') ? 'bg-primary-50 text-primary-900 border-primary-100 font-bold' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                >
                    <i className="fas fa-tags mr-2"></i>Categories
                </Link>

                <Link
                    to="/admin/users"
                    className={`btn btn-sm border ${isActive('/admin/users') ? 'bg-primary-50 text-primary-900 border-primary-100 font-bold' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                >
                    <i className="fas fa-users mr-2"></i>Users
                </Link>
            </div>
        </div>
    );
}
