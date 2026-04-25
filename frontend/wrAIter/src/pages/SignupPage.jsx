import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, BookOpen, ArrowRight } from 'lucide-react';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const SignupPage = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email) return 'Email is required';
        if (!re.test(email)) return 'Enter a valid email';
        const blocked = ['test@test.com', 'test@example.com', 'a@a.com'];
        if (blocked.includes(email.toLowerCase())) return 'Use a real email';
        return '';
    };

    const validate = () => {
        const e = {};
        if (!formData.name.trim()) e.name = 'Name is required';
        const emailErr = validateEmail(formData.email);
        if (emailErr) e.email = emailErr;
        if (!formData.password) e.password = 'Password is required';
        else if (formData.password.length < 6) e.password = 'At least 6 characters';
        if (!formData.confirmPassword) e.confirmPassword = 'Confirm your password';
        else if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await register(formData.name, formData.email, formData.password);
            toast.success('Account created!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const set = (f, v) => {
        setFormData({ ...formData, [f]: v });
        if (errors[f]) setErrors({ ...errors, [f]: '' });
    };

    return (
        <div className="min-h-screen flex">
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-1/2 gradient-bg relative overflow-hidden items-center justify-center p-12">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-20 right-20 w-44 h-44 rounded-full bg-white/20 blur-3xl" />
                    <div className="absolute bottom-24 left-16 w-52 h-52 rounded-full bg-white/15 blur-3xl" />
                </div>
                <div className="relative z-10 max-w-md text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
                        <BookOpen size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Start your writing journey</h1>
                    <p className="text-white/70 text-lg leading-relaxed">
                        Create beautiful ebooks with AI. From idea to published — in minutes.
                    </p>
                </div>
            </div>

            {/* Right form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
                <div className="w-full max-w-md animate-fade-in-up">
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center">
                            <BookOpen size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-bold">wr<span className="gradient-text">AI</span>ter</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-text-primary mb-2">Create your account</h2>
                        <p className="text-text-secondary text-sm">Get started with wrAIter in just a few steps</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <InputField id="su-name" label="Full Name" icon={User} placeholder="John Doe" value={formData.name} onChange={(e) => set('name', e.target.value)} error={errors.name} autoComplete="name" />
                        <InputField id="su-email" label="Email" type="email" icon={Mail} placeholder="you@example.com" value={formData.email} onChange={(e) => set('email', e.target.value)} error={errors.email} autoComplete="email" />
                        <InputField id="su-pass" label="Password" type="password" icon={Lock} placeholder="At least 6 characters" value={formData.password} onChange={(e) => set('password', e.target.value)} error={errors.password} autoComplete="new-password" />
                        <InputField id="su-cpass" label="Confirm Password" type="password" icon={Lock} placeholder="Re-enter password" value={formData.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)} error={errors.confirmPassword} autoComplete="new-password" />
                        <div className="pt-1">
                            <Button type="submit" fullWidth loading={loading} size="lg" icon={ArrowRight} iconPosition="right">Create account</Button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm text-text-secondary">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:text-primary-dark font-semibold transition-colors">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
