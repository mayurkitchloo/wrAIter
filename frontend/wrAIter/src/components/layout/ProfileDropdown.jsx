import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, Settings } from 'lucide-react';
import Dropdown from '../ui/Dropdown';

const ProfileDropdown = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const items = [
        {
            label: 'Profile',
            icon: Settings,
            onClick: () => navigate('/profile'),
        },
        { divider: true },
        {
            label: 'Log out',
            icon: LogOut,
            danger: true,
            onClick: () => {
                logout();
                navigate('/login');
            },
        },
    ];

    const trigger = (
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-surface-alt transition-colors">
            <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-semibold">
                {user?.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                    />
                ) : (
                    getInitials(user?.name)
                )}
            </div>
            <span className="text-sm font-medium text-text-primary hidden sm:block max-w-[120px] truncate">
                {user?.name}
            </span>
        </div>
    );

    return (
        <Dropdown
            trigger={trigger}
            items={items}
            isOpen={isOpen}
            onToggle={setIsOpen}
            align="right"
        />
    );
};

export default ProfileDropdown;
