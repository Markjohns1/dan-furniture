import { useState } from 'react';
import Header from '../../components/layout/Header';
import SEO from '../../components/ui/SEO';

export default function Legal() {
    const [activeTab, setActiveTab] = useState('privacy');

    return (
        <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
            <SEO
                title="Legal - Terms & Privacy"
                description="Terms of Service and Privacy Policy for Daniel Furniture."
            />
            <Header title="Legal" showBack />

            <main className="container-app py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-100">
                        <button
                            onClick={() => setActiveTab('privacy')}
                            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider ${activeTab === 'privacy'
                                ? 'bg-primary-50 text-primary-900 border-b-2 border-primary-900'
                                : 'text-secondary-600 hover:text-primary-900 hover:bg-gray-50'
                                }`}
                        >
                            Privacy Policy
                        </button>
                        <button
                            onClick={() => setActiveTab('terms')}
                            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider ${activeTab === 'terms'
                                ? 'bg-primary-50 text-primary-900 border-b-2 border-primary-900'
                                : 'text-secondary-600 hover:text-primary-900 hover:bg-gray-50'
                                }`}
                        >
                            Terms of Service
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-10 prose prose-slate max-w-none text-secondary-900">
                        {activeTab === 'privacy' ? (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary-950">Privacy Policy</h2>
                                <p className="text-sm text-secondary-500 uppercase font-black tracking-tight">Last Updated: January 2026</p>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900">1. Information We Collect</h3>
                                    <p className="text-gray-600">
                                        We collect information you provide directly to us, such as when you create an account, place an order, or contact us. This may include your name, email address, phone number, and delivery address.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900">2. How We Use Your Information</h3>
                                    <p className="text-gray-600">
                                        We use your information to:
                                        <ul className="list-disc pl-5 mt-2 space-y-1">
                                            <li>Process and fulfill your orders via WhatsApp or direct delivery.</li>
                                            <li>Communicate with you about your account or orders.</li>
                                            <li>Send you updates or promotional materials (only if you opt-in).</li>
                                        </ul>
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900">3. Data Security</h3>
                                    <p className="text-gray-600">
                                        We implement industry-standard security measures (including JWT authentication and bcrypt password hashing) to protect your personal information. However, no method of transmission over the Internet is 100% secure.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900">4. Contact Us</h3>
                                    <p className="text-gray-600">
                                        If you have any questions about this Privacy Policy, please contact us at <span className="font-semibold text-primary-700">info@danielfurniture.co.ke</span>.
                                    </p>
                                </section>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary-950">Terms of Service</h2>
                                <p className="text-sm text-secondary-500 uppercase font-black tracking-tight">Last Updated: January 2026</p>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900">1. Acceptance of Terms</h3>
                                    <p className="text-gray-600">
                                        By accessing or using the Daniel Furniture website, you agree to be bound by these Terms of Service. If you do not agree, strictly do not use our services.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900">2. Products and Pricing</h3>
                                    <p className="text-gray-600">
                                        All products are subject to availability. We reserve the right to limit the quantity of products we supply. Prices are subject to change without notice. In the event of a pricing error, we reserve the right to cancel any orders placed at the incorrect price.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900">3. Orders and Payments</h3>
                                    <p className="text-gray-600">
                                        Orders placed through our website are essentially inquiries or reservations. Final payment and delivery details are typically confirmed via WhatsApp or phone. We are not liable for any delays caused by third-party delivery services.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900">4. User Accounts</h3>
                                    <p className="text-gray-600">
                                        You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.
                                    </p>
                                </section>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
