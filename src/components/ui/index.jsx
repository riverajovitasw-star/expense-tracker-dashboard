import React from 'react';
import { X } from 'lucide-react';

// Modal
export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className={`relative w-full ${sizes[size]} glass-card animate-scale-in shadow-2xl shadow-black/50`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-800/50">
          <h2 className="font-display font-bold text-white text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 flex items-center justify-center
                       text-gray-400 hover:text-white transition-all duration-200"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// Stat Card
export function StatCard({ title, value, subtitle, icon: Icon, color = 'violet', trend }) {
  const colors = {
    violet: { bg: 'bg-accent-violet/10', border: 'border-accent-violet/20', icon: 'text-accent-violet', text: 'text-accent-violet' },
    green: { bg: 'bg-accent-green/10', border: 'border-accent-green/20', icon: 'text-accent-green', text: 'text-accent-green' },
    red: { bg: 'bg-accent-red/10', border: 'border-accent-red/20', icon: 'text-accent-red', text: 'text-accent-red' },
    blue: { bg: 'bg-accent-blue/10', border: 'border-accent-blue/20', icon: 'text-accent-blue', text: 'text-accent-blue' },
    yellow: { bg: 'bg-accent-yellow/10', border: 'border-accent-yellow/20', icon: 'text-accent-yellow', text: 'text-accent-yellow' },
  };
  const c = colors[color] || colors.violet;

  return (
    <div className={`stat-card border ${c.border}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
          <Icon size={20} className={c.icon} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${trend >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
      <p className={`font-display font-bold text-2xl ${c.text}`}>{value}</p>
      {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
    </div>
  );
}

// Loading Spinner
export function Spinner({ size = 'md' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} rounded-full border-2 border-accent-violet border-t-transparent animate-spin`} />
  );
}

// Empty State
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-800/50 flex items-center justify-center mb-4">
        <Icon size={28} className="text-gray-600" />
      </div>
      <h3 className="font-display font-semibold text-gray-300 text-lg mb-2">{title}</h3>
      <p className="text-gray-500 text-sm max-w-xs mb-5">{description}</p>
      {action}
    </div>
  );
}

// Badge
export function CategoryBadge({ category }) {
  const colors = {
    Food: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
    Transportation: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    Shopping: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
    Bills: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    Entertainment: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    Education: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
    Health: 'bg-green-500/15 text-green-400 border-green-500/20',
    Other: 'bg-gray-500/15 text-gray-400 border-gray-500/20',
    Salary: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    Freelance: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
    Investment: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    Business: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
    Bonus: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    Gift: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
  };
  return (
    <span className={`badge border ${colors[category] || colors.Other}`}>
      {category}
    </span>
  );
}

// Page Header
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-7">
      <div>
        <h1 className="font-display font-bold text-white text-2xl">{title}</h1>
        {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// Confirm Dialog
export function ConfirmDialog({ open, onClose, onConfirm, title, message, loading }) {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-gray-400 text-sm mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="btn-secondary text-sm">Cancel</button>
        <button onClick={onConfirm} disabled={loading} className="btn-danger text-sm">
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
}
