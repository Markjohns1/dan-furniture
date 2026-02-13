/**
 * Dan Classic Furniture - Footer Component
 * Premium design with enhanced aesthetics
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

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-b from-primary-950 to-primary-900 text-white pt-20 pb-28 lg:pb-16 border-t border-primary-800 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-400/5 rounded-full blur-[100px]"></div>

            <div className="container-app relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 space-y-6">
                        <Link to="/" className="inline-block group">
                            <div className="flex items-center gap-2.5">
                                <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center shadow-lg">
                                    <span className="text-primary-950 font-display font-black text-lg tracking-tighter">TW</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-display font-black tracking-tight text-white leading-none">TOUCH</span>
                                    <span className="text-xl font-display font-black tracking-tight text-amber-500 leading-none">WOOD</span>
                                </div>
                            </div>
                        </Link>
                        <p className="text-white/80 leading-relaxed font-medium text-sm">
                            Crafting premium furniture for Kenyan homes since 2024.
                            Where luxury, quality, and comfort unite to create your perfect living spaces.
                        </p>

                        {/* Social Links - Enhanced */}
                        <div className="flex gap-3 pt-2">
                            {[
                                { icon: 'fa-facebook-f', href: '#', label: 'Facebook', color: 'hover:bg-blue-500' },
                                { icon: 'fa-instagram', href: '#', label: 'Instagram', color: 'hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500' },
                                { icon: 'fa-twitter', href: '#', label: 'Twitter', color: 'hover:bg-sky-500' },
                                { icon: 'fa-whatsapp', href: 'https://wa.me/254799366734', label: 'WhatsApp', color: 'hover:bg-green-500' },
                            ].map((social) => (
                                <a
                                    key={social.icon}
                                    href={social.href}
                                    aria-label={social.label}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 ${social.color} hover:text-white hover:border-transparent hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                                >
                                    <i className={`fab ${social.icon}`}></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div className="col-span-1">
                        <h4 className="font-display font-semibold text-lg mb-6 text-white flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-amber-500 rounded-full"></span>
                            Shop Collection
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { name: 'Sofasets', slug: 'sofasets' },
                                { name: 'Dining Sets', slug: 'dining-sets' },
                                { name: 'Beds', slug: 'beds' },
                                { name: 'Office Chairs', slug: 'office-chairs' },
                                { name: 'Accent Chairs', slug: 'chairs' }
                            ].map(cat => (
                                <li key={cat.slug}>
                                    <Link
                                        to={`/products?category=${cat.slug}`}
                                        className="text-white/70 hover:text-white transition-all flex items-center gap-3 group font-medium text-sm"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary-600 group-hover:bg-amber-500 transition-colors"></span>
                                        <span className="group-hover:translate-x-1 transition-transform">{cat.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Info */}
                    <div className="col-span-1">
                        <h4 className="font-display font-semibold text-lg mb-6 text-white flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-amber-500 rounded-full"></span>
                            Contact & Info
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { icon: 'fa-envelope', label: 'Contact Us', to: '/contact', isLink: true },
                                { icon: 'fa-phone', label: '+254 799 366734', href: 'tel:+254799366734' },
                                { icon: 'fa-map-marker-alt', label: 'Nairobi, Kenya', href: '#' },
                                { icon: 'fa-shield-alt', label: 'Privacy Policy', to: '/legal', isLink: true },
                                { icon: 'fa-file-contract', label: 'Terms of Service', to: '/legal', isLink: true },
                            ].map((item, index) => (
                                <li key={index}>
                                    {item.isLink ? (
                                        <Link
                                            to={item.to}
                                            className="text-white/70 hover:text-white transition-all flex items-center gap-3 font-medium text-sm group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                                <i className={`fas ${item.icon} text-xs text-amber-400`}></i>
                                            </div>
                                            <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
                                        </Link>
                                    ) : (
                                        <a
                                            href={item.href}
                                            className="text-white/70 hover:text-white transition-all flex items-center gap-3 font-medium text-sm group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                                <i className={`fas ${item.icon} text-xs text-amber-400`}></i>
                                            </div>
                                            <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="col-span-1">
                        <h4 className="font-display font-semibold text-lg mb-6 text-white flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-amber-500 rounded-full"></span>
                            Stay in the Loop
                        </h4>
                        <p className="text-white/70 mb-5 text-sm font-medium leading-relaxed">
                            Subscribe for exclusive deals, new arrivals, and interior design inspiration.
                        </p>
                        <form onSubmit={handleNewsletter} className="relative">
                            <input
                                type="email"
                                required
                                placeholder="Your email address"
                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-amber-500/50 focus:bg-white/10 text-white placeholder:text-white/40 transition-all pr-14"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-primary-950 rounded-lg hover:bg-amber-400 transition-all flex items-center justify-center font-bold shadow-lg"
                            >
                                <i className="fas fa-arrow-right text-sm"></i>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Strip - Enhanced */}
                <div className="border-t border-white/10 pt-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-sm text-white/60 text-center md:text-left font-medium">
                            © {currentYear} Touch Wood. All rights reserved.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-white/60">
                            <span className="flex items-center gap-2 font-medium">
                                <i className="fas fa-lock text-amber-400"></i>
                                Secure Payment
                            </span>
                            <span className="flex items-center gap-2 font-medium">
                                <i className="fas fa-truck text-amber-400"></i>
                                Countrywide Delivery
                            </span>
                            <span className="flex items-center gap-2 font-medium">
                                <i className="fas fa-medal text-amber-400"></i>
                                Quality Guaranteed
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
