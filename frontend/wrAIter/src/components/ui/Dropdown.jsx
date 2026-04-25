import React, { useRef, useEffect } from 'react';

const Dropdown = ({
    trigger,
    items = [],
    isOpen,
    onToggle,
    align = 'right',
    className = '',
}) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                if (isOpen) onToggle(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onToggle]);

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            <div onClick={() => onToggle(!isOpen)} className="cursor-pointer">
                {trigger}
            </div>

            {isOpen && (
                <div
                    className={`
                        absolute top-full mt-2 z-50
                        ${align === 'right' ? 'right-0' : 'left-0'}
                        min-w-[180px] bg-white rounded-xl border border-border
                        shadow-elevated py-1.5 animate-slide-down
                    `}
                >
                    {items.map((item, index) =>
                        item.divider ? (
                            <div
                                key={`divider-${index}`}
                                className="my-1.5 border-t border-border"
                            />
                        ) : (
                            <button
                                key={item.label || index}
                                onClick={() => {
                                    item.onClick?.();
                                    onToggle(false);
                                }}
                                className={`
                                    w-full px-4 py-2.5 text-sm text-left flex items-center gap-2.5
                                    transition-colors cursor-pointer
                                    ${item.danger
                                        ? 'text-error hover:bg-error/5'
                                        : 'text-text-primary hover:bg-surface-alt'
                                    }
                                `}
                            >
                                {item.icon && <item.icon size={16} className="text-text-muted" />}
                                {item.label}
                            </button>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
