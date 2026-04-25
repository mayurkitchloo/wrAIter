import React from 'react';
import { ChevronDown } from 'lucide-react';

const SelectField = ({
    label,
    value,
    onChange,
    options = [],
    placeholder = 'Select an option',
    error,
    disabled = false,
    required = false,
    id,
}) => {
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
                <select
                    id={id}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    className={`
                        w-full px-4 py-3 rounded-xl text-sm text-text-primary
                        bg-white border transition-all duration-200 outline-none
                        appearance-none pr-10 cursor-pointer
                        ${error
                            ? 'border-error/40 focus:border-error focus:ring-2 focus:ring-error/10'
                            : 'border-border hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/10'
                        }
                        ${disabled ? 'opacity-50 cursor-not-allowed bg-surface-alt' : ''}
                        ${!value ? 'text-text-muted/60' : ''}
                    `}
                >
                    <option value="" disabled>
                        {placeholder}
                    </option>
                    {options.map((opt) => (
                        <option key={opt.value || opt} value={opt.value || opt}>
                            {opt.label || opt}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    size={16}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                />
            </div>
            {error && (
                <p className="mt-1.5 text-xs text-error animate-fade-in-down">
                    {error}
                </p>
            )}
        </div>
    );
};

export default SelectField;
