import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, CreditCard, TrendingUp, BarChart3,
  User, LogOut, ChevronLeft, ChevronRight, Wallet
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/expenses', icon: CreditCard, label: 'Expenses' },
  { path: '/income', icon: TrendingUp, label: 'Income' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300
        ${collapsed ? 'w-[72px]' : 'w-[240px]'}
        bg-dark-200 border-r border-gray-800/50`}
      style={{ background: 'linear-gradient(180deg, #16192a 0%, #12152400 100%), #16192a' }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-gray-800/40 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-violet to-accent-indigo flex items-center justify-center flex-shrink-0 shadow-lg shadow-accent-violet/30">
          <Wallet size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <p className="font-display font-bold text-white text-sm leading-tight">ExpenseTracker</p>
            <p className="text-gray-500 text-xs">Dashboard</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                ${active
                  ? 'bg-accent-violet/15 text-accent-violet border border-accent-violet/25'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent-violet rounded-r-full" />
              )}
              <Icon size={18} className={active ? 'text-accent-violet' : ''} />
              {!collapsed && (
                <span className="text-sm font-medium animate-fade-in">{label}</span>
              )}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-dark-200 border border-gray-700/50 rounded-lg
                                text-xs font-medium text-white whitespace-nowrap opacity-0 pointer-events-none
                                group-hover:opacity-100 transition-opacity duration-200 shadow-xl">
                  {label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-gray-800/40 space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-dark-400/50 animate-fade-in">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-200 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all duration-200
            text-gray-400 hover:text-red-400 hover:bg-red-500/10
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <LogOut size={18} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all duration-200
            text-gray-500 hover:text-gray-300 hover:bg-gray-800/50
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="text-sm font-medium">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
