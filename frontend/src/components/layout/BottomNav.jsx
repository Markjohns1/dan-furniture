/**
 * Dan Classic Furniture - Mobile Bottom Navigation
 * Only shows on mobile screens (< 1024px)
 */
import { NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function BottomNav() {
    const { itemCount } = useCart();
    const { isAdmin } = useAuth();
    const location = useLocation();

    // Don't show on auth pages or desktop
    if (location.pathname.startsWith('/login') || location.pathname.startsWith('/register')) {
        return null;
    }

    // Admin navigation
    const adminItems = [
        { to: '/admin', icon: 'fa-chart-line', label: 'Dashboard', exact: true },
        { to: '/admin/products', icon: 'fa-couch', label: 'Products' },
        { to: '/admin/orders', icon: 'fa-box', label: 'Orders' },
        { to: '/profile', icon: 'fa-user', label: 'Profile' },
    ];

    // Customer navigation  
    const customerItems = [
        { to: '/', icon: 'fa-home', label: 'Home', exact: true },
        { to: '/products', icon: 'fa-th-large', label: 'Shop' },
        { to: '/cart', icon: 'fa-shopping-cart', label: 'Cart', badge: itemCount },
        { to: '/profile', icon: 'fa-user', label: 'Account' },
    ];

    const navItems = isAdmin ? adminItems : customerItems;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2 pb-safe">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.exact}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-lg min-w-[60px] transition-colors ${isActive
                                ? 'text-primary-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`
                        }
                    >
                        <div className="relative">
                            <i className={`fas ${item.icon} text-xl`}></i>
                            {item.badge > 0 && (
                                <span className="absolute -top-2 -right-3 min-w-[18px] h-[18px] px-1 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {item.badge > 9 ? '9+' : item.badge}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
