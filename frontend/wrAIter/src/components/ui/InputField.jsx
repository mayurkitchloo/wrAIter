import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InputField = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    icon: Icon,
    disabled = false,
    required = false,
    autoComplete,
    id,
    name,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-text-secondary mb-1.5"
                >
                    {label}
                    {required && <span className="text-error ml-0.5">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    id={id}
                    name={name}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    autoComplete={autoComplete}
                    className={`
                        w-full px-4 py-3 rounded-xl text-sm text-text-primary
                        bg-white border transition-all duration-200 outline-none
                        placeholder:text-text-muted/60
                        ${Icon ? 'pl-11' : ''}
                        ${isPassword ? 'pr-11' : ''}
                        ${error
                            ? 'border-error/40 focus:border-error focus:ring-2 focus:ring-error/10'
                            : 'border-border hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/10'
                        }
                        ${disabled ? 'opacity-50 cursor-not-allowed bg-surface-alt' : ''}
                    `}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors p-0.5"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            {error && (
                <p className="mt-1.5 text-xs text-error animate-fade-in-down">
                    {error}
                </p>
            )}
        </div>
    );
};

export default InputField;
