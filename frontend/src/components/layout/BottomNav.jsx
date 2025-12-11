/**
 * Dan Classic Furniture - Bottom Navigation
 */
import { NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function BottomNav() {
    const { itemCount } = useCart();
    const { isAdmin } = useAuth();
    const location = useLocation();

    // Don't show bottom nav on auth pages
    if (location.pathname.startsWith('/login') || location.pathname.startsWith('/register')) {
        return null;
    }

    // Admin navigation items
    const adminItems = [
        { to: '/admin', icon: 'fa-chart-line', label: 'Dashboard' },
        { to: '/admin/products', icon: 'fa-couch', label: 'Products' },
        { to: '/admin/orders', icon: 'fa-box', label: 'Orders' },
        { to: '/admin/customers', icon: 'fa-users', label: 'Customers' },
        { to: '/profile', icon: 'fa-user', label: 'Profile' },
    ];

    // Customer navigation items
    const customerItems = [
        { to: '/', icon: 'fa-home', label: 'Home' },
        { to: '/products', icon: 'fa-couch', label: 'Products' },
        { to: '/cart', icon: 'fa-shopping-cart', label: 'Cart', badge: itemCount },
        { to: '/profile', icon: 'fa-user', label: 'Account' },
    ];

    const navItems = isAdmin ? adminItems : customerItems;

    return (
        <nav className="bottom-nav">
            <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/' || item.to === '/admin'}
                        className={({ isActive }) =>
                            `bottom-nav-item relative ${isActive ? 'active' : ''}`
                        }
                    >
                        <div className="relative">
                            <i className={`fas ${item.icon}`}></i>
                            {item.badge > 0 && (
                                <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {item.badge > 99 ? '99+' : item.badge}
                                </span>
                            )}
                        </div>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
