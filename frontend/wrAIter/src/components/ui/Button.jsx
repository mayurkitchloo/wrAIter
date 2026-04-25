import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
    primary:
        'gradient-bg text-white hover:opacity-90 shadow-soft hover:shadow-elevated',
    secondary:
        'bg-white text-text-primary border border-border hover:bg-surface-alt hover:border-primary/30',
    ghost:
        'bg-transparent text-text-secondary hover:bg-surface-alt hover:text-text-primary',
    danger:
        'bg-error/10 text-error hover:bg-error/20 border border-error/20',
    outline:
        'bg-transparent text-primary border border-primary/30 hover:bg-primary/5',
};

const sizes = {
    sm: 'px-3.5 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
};

const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    icon: Icon,
    iconPosition = 'left',
    className = '',
    ...props
}) => {
    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`
                inline-flex items-center justify-center gap-2 
                rounded-xl font-medium transition-all duration-200
                cursor-pointer select-none
                active:scale-[0.98]
                ${variants[variant] || variants.primary}
                ${sizes[size] || sizes.md}
                ${fullWidth ? 'w-full' : ''}
                ${isDisabled ? 'opacity-50 cursor-not-allowed active:scale-100' : ''}
                ${className}
            `}
            {...props}
        >
            {loading ? (
                <>
                    <Loader2 size={size === 'sm' ? 14 : 16} className="animate-spin" />
                    <span>{typeof children === 'string' ? children : 'Loading...'}</span>
                </>
            ) : (
                <>
                    {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : 16} />}
                    {children}
                    {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : 16} />}
                </>
            )}
        </button>
    );
};

export default Button;
