import React from 'react';

const TextareaField = ({
    label,
    value,
    onChange,
    placeholder,
    rows = 4,
    error,
    disabled = false,
    required = false,
    id,
    maxLength,
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
            <textarea
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                disabled={disabled}
                required={required}
                maxLength={maxLength}
                className={`
                    w-full px-4 py-3 rounded-xl text-sm text-text-primary
                    bg-white border transition-all duration-200 outline-none
                    placeholder:text-text-muted/60 resize-y min-h-[80px]
                    ${error
                        ? 'border-error/40 focus:border-error focus:ring-2 focus:ring-error/10'
                        : 'border-border hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/10'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed bg-surface-alt' : ''}
                `}
            />
            <div className="flex items-center justify-between mt-1">
                {error && (
                    <p className="text-xs text-error animate-fade-in-down">
                        {error}
                    </p>
                )}
                {maxLength && (
                    <p className="text-xs text-text-muted ml-auto">
                        {(value || '').length}/{maxLength}
                    </p>
                )}
            </div>
        </div>
    );
};

export default TextareaField;
