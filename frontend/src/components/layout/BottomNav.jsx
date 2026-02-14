/**
 * Dan Classic Furniture - Mobile Bottom Navigation
 * Premium UI with smooth animations
 * Only shows on mobile screens (< 1024px)
 */
import { NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function BottomNav() {
    const { itemCount, openCart, closeCart } = useCart();
    const { isAdmin } = useAuth();
    const location = useLocation();

    // Don't show on auth pages
    if (location.pathname.startsWith('/login') || location.pathname.startsWith('/register')) {
        return null;
    }

    // Admin navigation
    const adminItems = [
        { to: '/admin', icon: 'fa-chart-line', label: 'Dashboard', exact: true, onClick: () => closeCart() },
        { to: '/admin/products', icon: 'fa-couch', label: 'Products', onClick: () => closeCart() },
        { to: '/admin/orders', icon: 'fa-box', label: 'Orders', onClick: () => closeCart() },
        { to: '/admin/users', icon: 'fa-users', label: 'Users', onClick: () => closeCart() },
    ];

    // Customer navigation  
    const customerItems = [
        { to: '/', icon: 'fa-home', label: 'Home', exact: true, onClick: () => closeCart() },
        { to: '/products', icon: 'fa-th-large', label: 'Shop', onClick: () => closeCart() },
        {
            to: '/cart',
            icon: 'fa-shopping-bag',
            label: 'Cart',
            badge: itemCount,
            onClick: (e) => {
                e.preventDefault();
                openCart();
            }
        },
        { to: '/profile', icon: 'fa-user', label: 'Account', onClick: () => closeCart() },
    ];

    const navItems = isAdmin ? adminItems : customerItems;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[110] bg-white/98 backdrop-blur-xl border-t border-gray-100 lg:hidden pb-safe shadow-[0_-4px_30px_rgba(0,0,0,0.06)]">
            <div className="flex justify-around items-center h-[68px] max-w-lg mx-auto">
                {navItems.map((item) => {
                    const isActive = item.exact
                        ? location.pathname === item.to
                        : location.pathname.startsWith(item.to);

                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={item.onClick}
                            className={`relative flex flex-col items-center justify-center gap-1 min-w-[70px] py-2 transition-all duration-300 ${isActive ? 'text-primary-950' : 'text-secondary-400 active:text-primary-700'
                                }`}
                        >
                            {/* Active Indicator Line */}
                            {isActive && (
                                <span className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-950 rounded-full animate-fade-in" />
                            )}

                            {/* Icon Container */}
                            <div className={`relative transition-all duration-300 ${isActive ? 'scale-110' : ''}`}>
                                <div className={`w-9 h-9 flex items-center justify-center transition-all duration-300`}>
                                    <i className={`fas ${item.icon} ${isActive ? 'text-xl' : 'text-lg'} transition-all`}></i>
                                </div>

                                {/* Cart Badge */}
                                {item.badge !== undefined && (
                                    <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm ${item.badge === 0
                                        ? 'bg-gray-400'
                                        : 'bg-amber-500'
                                        }`}>
                                        {item.badge}
                                    </span>
                                )}
                            </div>

                            {/* Label */}
                            <span className={`text-[9px] font-bold uppercase tracking-[0.05em] transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-60'
                                }`}>
                                {item.label}
                            </span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
}
