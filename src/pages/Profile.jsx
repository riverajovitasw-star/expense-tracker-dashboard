import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { PageHeader } from '../components/ui/index.jsx';
import { User, Mail, Lock, Save, Shield, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const submitProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const { data } = await authAPI.updateProfile(profileForm);
      updateUser(data.user);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('New passwords do not match');
    if (pwForm.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setPwLoading(true);
    try {
      await authAPI.changePassword(pwForm);
      toast.success('Password changed successfully');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in max-w-3xl">
      <PageHeader title="Profile Settings" subtitle="Manage your account information and security" />

      {/* Profile Card */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-800/50">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-violet to-accent-indigo flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-accent-violet/30">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-display font-bold text-white text-lg">{user?.name}</h2>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <span className="badge bg-accent-violet/10 text-accent-violet border border-accent-violet/20 mt-2">
              <Shield size={11} className="mr-1" /> {user?.role === 'admin' ? 'Administrator' : 'Standard User'}
            </span>
          </div>
        </div>

        <form onSubmit={submitProfile} className="space-y-4">
          <h3 className="font-display font-semibold text-white text-sm mb-1">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="email" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="input-field pl-10" />
              </div>
            </div>
          </div>
          <button type="submit" disabled={profileLoading} className="btn-primary flex items-center gap-2 text-sm">
            {profileLoading ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <Save size={15} />}
            Save Changes
          </button>
        </form>
      </div>

      {/* Password Card */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold text-white text-sm mb-4">Change Password</h3>
        <form onSubmit={submitPassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Current Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="password" value={pwForm.currentPassword}
                onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                className="input-field pl-10" placeholder="Enter current password" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">New Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="password" value={pwForm.newPassword}
                  onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
                  className="input-field pl-10" placeholder="Min. 6 characters" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Confirm New Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="password" value={pwForm.confirmPassword}
                  onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                  className="input-field pl-10" placeholder="Repeat new password" />
              </div>
            </div>
          </div>
          <button type="submit" disabled={pwLoading} className="btn-primary flex items-center gap-2 text-sm">
            {pwLoading ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <Lock size={15} />}
            Update Password
          </button>
        </form>
      </div>

      {/* Account Info */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold text-white text-sm mb-4">Account Information</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-800/30">
            <span className="text-gray-400 text-sm flex items-center gap-2"><Shield size={14} /> Account Type</span>
            <span className="text-gray-200 text-sm font-medium capitalize">{user?.role}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-400 text-sm flex items-center gap-2"><Calendar size={14} /> User ID</span>
            <span className="text-gray-500 text-xs font-mono">{user?._id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
