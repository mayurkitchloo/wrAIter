import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        { label: 'Dashboard', path: '/dashboard' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-40 glass border-b border-border/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 group"
                    >
                        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center group-hover:scale-105 transition-transform">
                            <BookOpen size={18} className="text-white" />
                        </div>
                        <span className="text-lg font-bold text-text-primary">
                            wr<span className="gradient-text">AI</span>ter
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`
                                    px-3.5 py-2 rounded-lg text-sm font-medium transition-colors
                                    ${isActive(link.path)
                                        ? 'text-primary bg-primary/5'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
                                    }
                                `}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        <ProfileDropdown />

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2 rounded-lg text-text-secondary hover:bg-surface-alt transition-colors cursor-pointer"
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                {mobileOpen && (
                    <div className="md:hidden pb-4 animate-slide-down">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileOpen(false)}
                                className={`
                                    block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                    ${isActive(link.path)
                                        ? 'text-primary bg-primary/5'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
                                    }
                                `}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
