import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmText = 'Delete',
    cancelText = 'Cancel',
    variant = 'danger',
    loading = false,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="" size="sm" showClose={false}>
            <div className="text-center py-2">
                <div className="w-14 h-14 rounded-2xl bg-error/10 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={28} className="text-error" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
                <p className="text-sm text-text-secondary mb-6 max-w-xs mx-auto">{message}</p>
                <div className="flex items-center justify-center gap-3">
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        {cancelText}
                    </Button>
                    <Button variant={variant} loading={loading} onClick={onConfirm}>
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
