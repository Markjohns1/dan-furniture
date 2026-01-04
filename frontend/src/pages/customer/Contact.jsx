import { useState, useEffect } from 'react';
import { configAPI } from '../../api';
import Header from '../../components/layout/Header';
import SEO from '../../components/ui/SEO';
import WhatsAppButton from '../../components/ui/WhatsAppButton';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const [waNumber, setWaNumber] = useState(import.meta.env.VITE_WHATSAPP_NUMBER || '254724426993');

    // useEffect(() => {
    //     configAPI.get().then((res) => {
    //         if (res.data.whatsapp_number) setWaNumber(res.data.whatsapp_number);
    //     }).catch(() => { });
    // }, []);
    // ... Note: I need to encompass enough context or use 2 chunks.
    // I'll use 2 chunks logic or just update line 14 and line 60 separately.
    // Replace content tool requires contiguous if replace_file_content.
    // multi_replace is better.

    const handleSubmit = (e) => {
        e.preventDefault();
        const text = `*New Inquiry via Website*\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Message:* ${formData.message}`;
        const cleanedNumber = waNumber.toString().replace(/\D/g, '');
        const whatsappUrl = `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
        // Reset form or show success message could occur here
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
            <SEO
                title="Contact Us - Daniel Furniture"
                description="Get in touch with Daniel Furniture for custom orders, inquiries, or support."
            />
            <Header title="Contact Us" showBack />

            <main className="container-app py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-accent-600 text-xs font-bold uppercase tracking-widest">Get In Touch</span>
                        <h1 className="text-4xl font-display font-medium text-primary-950 mt-2 mb-4">We'd Love to Hear From You</h1>
                        <p className="text-secondary-500 max-w-xl mx-auto">
                            Whether you have a question about our products, need a custom piece, or just want to say hello, our team is ready to answer all your questions.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-primary-900 mb-4">Contact Information</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                                            <i className="fas fa-phone text-primary-600"></i>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">Phone</p>
                                            <p className="text-secondary-600">+254 724 426993</p>
                                            <p className="text-sm text-secondary-400">Mon-Sat 9am to 6pm</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                                            <i className="fas fa-envelope text-primary-600"></i>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">Email</p>
                                            <p className="text-secondary-600">info@danfurniture.co.ke</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                                            <i className="fas fa-map-marker-alt text-primary-600"></i>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">Location</p>
                                            <p className="text-secondary-600">Nairobi, Kenya</p>
                                            <p className="text-sm text-secondary-400">Available for deliveries countrywide</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-100">
                                <h3 className="text-xl font-bold text-primary-900 mb-4">Follow Us</h3>
                                <div className="flex gap-4">
                                    <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-primary-950 hover:text-white transition-all">
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-primary-950 hover:text-white transition-all">
                                        <i className="fab fa-facebook-f"></i>
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-primary-950 hover:text-white transition-all">
                                        <i className="fab fa-tiktok"></i>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="label">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        className="input"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="label">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        className="input"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="label">Message</label>
                                    <textarea
                                        id="message"
                                        required
                                        rows="4"
                                        className="input resize-none"
                                        placeholder="How can we help you?"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn-primary w-full py-3">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <WhatsAppButton />
        </div>
    );
}
