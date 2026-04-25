import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]',
};

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showClose = true,
}) => {
    const overlayRef = useRef(null);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) {
            onClose();
        }
    };

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-fade-in"
        >
            <div
                className={`
                    w-full ${sizeClasses[size] || sizeClasses.md}
                    bg-white rounded-2xl shadow-elevated
                    animate-scale-in overflow-hidden
                `}
            >
                {/* Header */}
                {(title || showClose) && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                        {title && (
                            <h3 className="text-lg font-semibold text-text-primary">
                                {title}
                            </h3>
                        )}
                        {showClose && (
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-alt transition-colors ml-auto cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                )}
                {/* Body */}
                <div className="px-6 py-5 max-h-[70vh] overflow-y-auto scrollbar-thin">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
