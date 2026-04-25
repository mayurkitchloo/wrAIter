import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, BookOpen, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import toast from 'react-hot-toast';

const STEPS = ['Email', 'Verify OTP', 'New Password', 'Done'];

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const startResendTimer = () => {
        setResendTimer(60);
        const interval = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) { clearInterval(interval); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSendOtp = async () => {
        if (!email) { setErrors({ email: 'Email is required' }); return; }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) { setErrors({ email: 'Enter a valid email' }); return; }

        setLoading(true);
        setErrors({});
        try {
            await axiosInstance.post(API_PATHS.AUTH.SEND_OTP, { email });
            toast.success('OTP sent to your email');
            setStep(1);
            startResendTimer();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally { setLoading(false); }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) { setErrors({ otp: 'Enter the 6-digit code' }); return; }

        setLoading(true);
        setErrors({});
        try {
            await axiosInstance.post(API_PATHS.AUTH.VERIFY_OTP, { email, otp });
            toast.success('OTP verified!');
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid OTP');
        } finally { setLoading(false); }
    };

    const handleResetPassword = async () => {
        const newErrors = {};
        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 6) newErrors.password = 'At least 6 characters';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

        setLoading(true);
        setErrors({});
        try {
            await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, { email, newPassword: password });
            toast.success('Password reset successfully!');
            setStep(3);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally { setLoading(false); }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;
        setLoading(true);
        try {
            await axiosInstance.post(API_PATHS.AUTH.SEND_OTP, { email });
            toast.success('OTP resent');
            startResendTimer();
            setOtp('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-surface-alt to-white p-6">
            <div className="w-full max-w-md animate-fade-in-up">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 mb-10 justify-center">
                    <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center">
                        <BookOpen size={20} className="text-white" />
                    </div>
                    <span className="text-xl font-bold text-text-primary">
                        wr<span className="gradient-text">AI</span>ter
                    </span>
                </Link>

                {/* Progress bar */}
                {step < 3 && (
                    <div className="flex items-center gap-1.5 mb-8">
                        {STEPS.slice(0, 3).map((s, i) => (
                            <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? 'gradient-bg' : 'bg-border'}`} />
                        ))}
                    </div>
                )}

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-soft border border-border/60 p-8">
                    {/* Step 0: Email */}
                    {step === 0 && (
                        <>
                            <h2 className="text-xl font-bold text-text-primary mb-2">Forgot password?</h2>
                            <p className="text-sm text-text-secondary mb-6">Enter your email and we'll send you a verification code.</p>
                            <div className="space-y-5">
                                <InputField id="fp-email" label="Email" type="email" icon={Mail} placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setErrors({}); }} error={errors.email} />
                                <Button fullWidth loading={loading} size="lg" onClick={handleSendOtp} icon={ArrowRight} iconPosition="right">Send OTP</Button>
                            </div>
                        </>
                    )}

                    {/* Step 1: OTP */}
                    {step === 1 && (
                        <>
                            <h2 className="text-xl font-bold text-text-primary mb-2">Enter verification code</h2>
                            <p className="text-sm text-text-secondary mb-6">We sent a 6-digit code to <span className="font-medium text-text-primary">{email}</span></p>
                            <div className="space-y-5">
                                <InputField
                                    id="fp-otp" label="Verification Code" type="text" placeholder="000000"
                                    value={otp}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                        setOtp(val); setErrors({});
                                    }}
                                    error={errors.otp}
                                />
                                <Button fullWidth loading={loading} size="lg" onClick={handleVerifyOtp}>Verify Code</Button>
                                <div className="text-center">
                                    <button onClick={handleResend} disabled={resendTimer > 0} className={`text-sm font-medium cursor-pointer ${resendTimer > 0 ? 'text-text-muted' : 'text-primary hover:text-primary-dark'} transition-colors`}>
                                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Step 2: New Password */}
                    {step === 2 && (
                        <>
                            <h2 className="text-xl font-bold text-text-primary mb-2">Set new password</h2>
                            <p className="text-sm text-text-secondary mb-6">Choose a strong password for your account.</p>
                            <div className="space-y-4">
                                <InputField id="fp-pass" label="New Password" type="password" icon={Lock} placeholder="At least 6 characters" value={password} onChange={(e) => { setPassword(e.target.value); setErrors({}); }} error={errors.password} />
                                <InputField id="fp-confirm" label="Confirm Password" type="password" icon={Lock} placeholder="Re-enter password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setErrors({}); }} error={errors.confirmPassword} />
                                <Button fullWidth loading={loading} size="lg" onClick={handleResetPassword}>Reset Password</Button>
                            </div>
                        </>
                    )}

                    {/* Step 3: Success */}
                    {step === 3 && (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 size={32} className="text-success" />
                            </div>
                            <h2 className="text-xl font-bold text-text-primary mb-2">Password reset!</h2>
                            <p className="text-sm text-text-secondary mb-6">Your password has been changed successfully.</p>
                            <Button fullWidth size="lg" onClick={() => navigate('/login')} icon={ArrowRight} iconPosition="right">Back to Sign in</Button>
                        </div>
                    )}
                </div>

                {step < 3 && (
                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors inline-flex items-center gap-1.5">
                            <ArrowLeft size={14} /> Back to Sign in
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
