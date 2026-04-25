import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import { User, Mail, Save, Shield, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState(user?.name || '');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error('Name cannot be empty');
            return;
        }
        setSaving(true);
        try {
            await updateProfile({ name });
            toast.success('Profile updated');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const getInitials = (n) => {
        if (!n) return '?';
        return n.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto animate-fade-in-up">
                {/* Back arrow + title */}
                <div className="flex items-center gap-3 mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 rounded-lg hover:bg-surface-alt transition-colors text-text-muted cursor-pointer"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-text-primary">Profile</h1>
                </div>

                {/* Avatar card */}
                <div className="bg-white rounded-2xl border border-border/60 shadow-soft p-6 mb-6">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-2xl object-cover" />
                            ) : (
                                getInitials(user?.name)
                            )}
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-text-primary">{user?.name}</h2>
                            <p className="text-sm text-text-secondary">{user?.email}</p>
                            <div className="flex items-center gap-1.5 mt-2">
                                <Shield size={13} className={user?.isPro ? 'text-warning' : 'text-text-muted'} />
                                <span className="text-xs font-medium text-text-muted">
                                    {user?.isPro ? 'Pro Plan' : 'Free Plan'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit form */}
                <div className="bg-white rounded-2xl border border-border/60 shadow-soft p-6">
                    <h3 className="text-base font-semibold text-text-primary mb-5">Edit Profile</h3>
                    <div className="space-y-4">
                        <InputField
                            id="profile-name"
                            label="Full Name"
                            icon={User}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                        />
                        <InputField
                            id="profile-email"
                            label="Email"
                            icon={Mail}
                            value={user?.email || ''}
                            disabled
                            onChange={() => {}}
                        />
                        <div className="pt-2">
                            <Button loading={saving} onClick={handleSave} icon={Save}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProfilePage;
