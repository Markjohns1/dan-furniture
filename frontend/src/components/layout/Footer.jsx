/**
 * Dan Classic Furniture - Footer Component
 */
import { Link } from 'react-router-dom';

export default function Footer() {
    const handleNewsletter = (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.classList.remove('bg-primary-900', 'hover:bg-primary-800');
        btn.classList.add('bg-green-600');

        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.classList.remove('bg-green-600');
            btn.classList.add('bg-primary-900', 'hover:bg-primary-800');
            e.target.reset();
        }, 2000);
    };

    return (
        <footer className="bg-white border-t border-gray-100 hidden lg:block">
            <div className="container-app py-12">
                <div className="grid grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 space-y-4">
                        <Link to="/" className="block">
                            <img src="/logo.svg" alt="Daniel Furniture" className="h-10 w-auto" />
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Crafting premium furniture for Kenyan homes. Standard, luxury, and comfort combined.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="col-span-1">
                        <h4 className="font-bold text-primary-900 mb-4 uppercase text-xs tracking-widest">Shop</h4>
                        <ul className="space-y-2">
                            {['Sofasets', 'Dining Sets', 'Beds', 'Chairs'].map(cat => (
                                <li key={cat}>
                                    <Link to={`/products?category=${cat.toLowerCase().replace(' ', '-')}`} className="text-sm text-gray-600 hover:text-primary-700">
                                        {cat}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="col-span-1">
                        <h4 className="font-bold text-primary-900 mb-4 uppercase text-xs tracking-widest">Company</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/contact" className="text-sm text-gray-600 hover:text-primary-700">Contact Us</Link>
                            </li>
                            <li>
                                <Link to="/legal" className="text-sm text-gray-600 hover:text-primary-700">Terms of Service</Link>
                            </li>
                            <li>
                                <Link to="/legal" className="text-sm text-gray-600 hover:text-primary-700">Privacy Policy</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="col-span-1">
                        <h4 className="font-bold text-primary-900 mb-4 uppercase text-xs tracking-widest">Stay Updated</h4>
                        <form onSubmit={handleNewsletter} className="flex">
                            <input
                                type="email"
                                required
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-l-lg text-sm focus:outline-none focus:border-primary-500"
                            />
                            <button type="submit" className="bg-primary-900 text-white px-4 py-2 rounded-r-lg hover:bg-primary-800 transition-colors">
                                <i className="fas fa-arrow-right"></i>
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-50 mt-12 pt-8 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                        &copy; {new Date().getFullYear()} Daniel Furniture. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors">
                            <i className="fab fa-facebook"></i>
                        </a>
                        <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-pink-600 cursor-pointer transition-colors">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors">
                            <i className="fab fa-twitter"></i>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
