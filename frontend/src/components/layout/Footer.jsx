/**
 * Dan Classic Furniture - Footer Component
 */
import { Link } from 'react-router-dom';

export default function Footer() {
    const handleNewsletter = (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const input = e.target.querySelector('input');
        const originalContent = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.classList.remove('bg-white', 'text-primary-900');
        btn.classList.add('bg-green-500', 'text-white');

        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.classList.remove('bg-green-500', 'text-white');
            btn.classList.add('bg-white', 'text-primary-900');
            input.value = '';
        }, 3000);
    };

    return (
        <footer className="bg-primary-950 text-white pt-16 pb-24 lg:pb-12 border-t border-primary-900">
            <div className="container-app">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 space-y-6">
                        <Link to="/" className="block">
                            <img
                                src="/logo.svg"
                                alt="Daniel Furniture"
                                className="h-12 w-auto brightness-0 invert"
                            />
                        </Link>
                        <p className="text-white/90 leading-relaxed font-medium">
                            Crafting premium furniture for Kenyan homes. Standard, luxury, and comfort combined.
                            Experience the difference of truly world-class design.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white hover:text-primary-900 transition-all duration-300">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white hover:text-primary-900 transition-all duration-300">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white hover:text-primary-900 transition-all duration-300">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="#" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white hover:text-primary-900 transition-all duration-300">
                                <i className="fab fa-whatsapp"></i>
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="col-span-1">
                        <h4 className="font-display font-medium text-lg mb-6 text-white">Shop Collection</h4>
                        <ul className="space-y-4">
                            {['Sofasets', 'Dining Sets', 'Beds', 'Office Chairs', 'Accent Chairs'].map(cat => (
                                <li key={cat}>
                                    <Link
                                        to={`/products?category=${cat.toLowerCase().replace(' ', '-')}`}
                                        className="text-white/80 hover:text-white transition-colors flex items-center gap-2 group font-medium"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-primary-700 group-hover:bg-accent-500 transition-colors"></span>
                                        {cat}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact - Merged Company & Contact for better mobile density */}
                    <div className="col-span-1">
                        <h4 className="font-display font-medium text-lg mb-6 text-white">Contact & Info</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/contact" className="text-white/80 hover:text-white transition-colors flex items-center gap-2 font-medium">
                                    <i className="fas fa-envelope w-4"></i> Contact Us
                                </Link>
                            </li>
                            <li>
                                <a href="tel:+254724426993" className="text-white/80 hover:text-white transition-colors flex items-center gap-2 font-medium">
                                    <i className="fas fa-phone w-4"></i> +254 724 426993
                                </a>
                            </li>
                            <li>
                                <Link to="/legal" className="text-white/80 hover:text-white transition-colors flex items-center gap-2 font-medium">
                                    <i className="fas fa-shield-alt w-4"></i> Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/legal" className="text-white/80 hover:text-white transition-colors flex items-center gap-2 font-medium">
                                    <i className="fas fa-file-contract w-4"></i> Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="col-span-1">
                        <h4 className="font-display font-medium text-lg mb-6 text-white">Stay in the Loop</h4>
                        <p className="text-white/90 mb-4 text-sm font-medium">
                            Subscribe to receive updates on new arrivals and exclusive offers.
                        </p>
                        <form onSubmit={handleNewsletter} className="relative">
                            <input
                                type="email"
                                required
                                placeholder="Your email address"
                                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent-500/50 focus:bg-white/10 text-white placeholder:text-white/30 transition-all"
                            />
                            <button
                                type="submit"
                                className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-white text-primary-950 rounded-lg hover:bg-accent-400 transition-all flex items-center justify-center font-bold"
                            >
                                <i className="fas fa-arrow-right"></i>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Strip */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-secondary-200 text-center md:text-left font-medium">
                        &copy; {new Date().getFullYear()} Daniel Furniture. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs text-secondary-200 font-bold">
                        <span className="flex items-center gap-2">
                            <i className="fas fa-lock"></i> Secure Payment
                        </span>
                        <span className="flex items-center gap-2">
                            <i className="fas fa-truck"></i> Countrywide Delivery
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
