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
    const [successMessage, setSuccessMessage] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        const result = await login(email.trim(), password);

        if (result.success) {
            setSuccessMessage('Login successful! Redirecting...');

            // Short delay to show success message
            setTimeout(() => {
                const targetPath = result.user.role === 'admin' ? '/admin' : redirect;
                navigate(targetPath);
            }, 800);
        } else {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 to-gray-100">
            <SEO title="Login - Touch Wood" />

            {/* Header */}
            <div className="p-4">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium">
                    <i className="fas fa-arrow-left"></i>
                    <span>Back to Shop</span>
                </Link>
            </div>

            {/* Form */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary-950 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                            <span className="text-amber-500 font-display font-black text-2xl tracking-tighter">TW</span>
                        </div>
                        <h1 className="font-display text-3xl font-bold text-gray-900">Welcome Back</h1>
                        <p className="text-gray-500 mt-1">Manage your Touch Wood showroom</p>
                    </div>

                    <div className="card p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {successMessage && (
                                <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200 flex items-center gap-2 animate-fade-in">
                                    <i className="fas fa-check-circle"></i>
                                    {successMessage}
                                </div>
                            )}
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                                    <i className="fas fa-exclamation-circle"></i>
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
                                className="btn btn-primary w-full justify-center py-3 text-base shadow-lg hover:shadow-xl transition-transform active:scale-95"
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


                </div>
            </div>
        </div>
    );
}
