/**
 * Dan Classic Furniture - Mobile Bottom Navigation
 * Only shows on mobile screens (< 1024px)
 */
import { NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function BottomNav() {
    const { itemCount, openCart, closeCart } = useCart();
    const { isAdmin } = useAuth();
    const location = useLocation();

    // Don't show on auth pages or desktop
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
        <nav className="fixed bottom-0 left-0 right-0 z-[110] bg-white/95 backdrop-blur-md border-t border-gray-100 lg:hidden pb-safe">
            <div className="flex justify-around items-center h-16 max-w-lg mx-auto overflow-hidden">
                {navItems.map((item) => {
                    const isActive = item.exact
                        ? location.pathname === item.to
                        : location.pathname.startsWith(item.to);

                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={item.onClick}
                            className={`relative flex flex-col items-center justify-center gap-1.5 min-w-[72px] transition-all duration-300 ${isActive ? 'text-primary-950' : 'text-secondary-600 hover:text-primary-900'
                                }`}
                        >
                            {/* Active Indicator Line - More Pronounced */}
                            {isActive && (
                                <span className="absolute -top-[1px] w-10 h-1 bg-primary-950 rounded-b-full animate-fade-in shadow-[0_1px_4px_rgba(15,23,42,0.2)]" />
                            )}

                            <div className="relative mt-1">
                                <i className={`fas ${item.icon} text-xl ${isActive ? 'scale-110 drop-shadow-sm' : 'opacity-80'} transition-all`}></i>
                                {item.badge !== undefined && (
                                    <span className={`absolute -top-2 -right-3 min-w-[19px] h-[19px] px-1 text-white text-[10px] font-semibold rounded-full flex items-center justify-center shadow-md border-2 border-white transition-all transform ${item.badge === 0
                                            ? 'bg-red-500 scale-90 opacity-90'
                                            : 'bg-cta-600 scale-110'
                                        }`}>
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-tight ${isActive ? 'opacity-100' : 'opacity-70'}`}>{item.label}</span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
}
