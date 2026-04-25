import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, BookOpen, ArrowRight } from 'lucide-react';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email) return 'Email is required';
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        // Block common dummy/test emails
        const blocked = ['test@test.com', 'test@example.com', 'user@test.com', 'admin@test.com', 'a@a.com'];
        if (blocked.includes(email.toLowerCase())) return 'Please use a real email address';
        return '';
    };

    const validate = () => {
        const newErrors = {};
        const emailErr = validateEmail(formData.email);
        if (emailErr) newErrors.email = emailErr;
        if (!formData.password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await login(formData.email, formData.password);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (error) {
            const msg = error.response?.data?.message || 'Login failed. Please try again.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left — Brand Panel */}
            <div className="hidden lg:flex lg:w-1/2 gradient-bg relative overflow-hidden items-center justify-center p-12">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-white/20 blur-3xl" />
                    <div className="absolute bottom-32 right-16 w-56 h-56 rounded-full bg-white/15 blur-3xl" />
                    <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
                </div>

                <div className="relative z-10 max-w-md text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
                        <BookOpen size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Welcome back to wrAIter
                    </h1>
                    <p className="text-white/70 text-lg leading-relaxed">
                        Continue crafting your stories with the power of AI. Your ideas, beautifully written.
                    </p>
                </div>
            </div>

            {/* Right — Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
                <div className="w-full max-w-md animate-fade-in-up">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center">
                            <BookOpen size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-bold text-text-primary">
                            wr<span className="gradient-text">AI</span>ter
                        </span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-text-primary mb-2">
                            Sign in to your account
                        </h2>
                        <p className="text-text-secondary text-sm">
                            Enter your credentials to access your dashboard
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <InputField
                            id="login-email"
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            icon={Mail}
                            value={formData.email}
                            onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value });
                                if (errors.email) setErrors({ ...errors, email: '' });
                            }}
                            error={errors.email}
                            autoComplete="email"
                        />

                        <InputField
                            id="login-password"
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            icon={Lock}
                            value={formData.password}
                            onChange={(e) => {
                                setFormData({ ...formData, password: e.target.value });
                                if (errors.password) setErrors({ ...errors, password: '' });
                            }}
                            error={errors.password}
                            autoComplete="current-password"
                        />

                        <div className="flex items-center justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            loading={loading}
                            size="lg"
                            icon={ArrowRight}
                            iconPosition="right"
                        >
                            Sign in
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-text-secondary">
                        Don't have an account?{' '}
                        <Link
                            to="/signup"
                            className="text-primary hover:text-primary-dark font-semibold transition-colors"
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
