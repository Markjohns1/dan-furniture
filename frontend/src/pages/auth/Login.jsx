/**
 * Dan Classic Furniture - Login Page
 */
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(email.trim(), password);

        if (result.success) {
            navigate(redirect);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 to-gray-100">
            {/* Header */}
            <div className="p-4">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
                    <i className="fas fa-arrow-left"></i>
                    <span>Back to Shop</span>
                </Link>
            </div>

            {/* Form */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-couch text-white text-2xl"></i>
                        </div>
                        <h1 className="font-display text-2xl font-bold text-gray-900">Welcome Back</h1>
                        <p className="text-gray-500 mt-1">Sign in to continue shopping</p>
                    </div>

                    <div className="card p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                    <i className="fas fa-exclamation-circle mr-2"></i>
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="label">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full"
                            >
                                {loading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-sign-in-alt"></i>
                                        Sign In
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-500">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700">
                                Create Account
                            </Link>
                        </div>
                    </div>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-white/50 rounded-lg text-center text-sm">
                        <p className="font-medium text-gray-700 mb-1">Admin Demo:</p>
                        <p className="text-gray-500">admin@danfurniture.co.ke / admin123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
