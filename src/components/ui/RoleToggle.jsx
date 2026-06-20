import React from 'react';
import { motion } from 'framer-motion';
import { Shield, User as UserIcon } from 'lucide-react';
import { useThemeColor } from '../../context/ThemeColorContext';

const DEMO_ACCOUNTS = {
  admin: { email: 'admin@expense.com', password: 'admin123', label: 'Admin', icon: Shield },
  user: { email: 'user@expense.com', password: 'user123', label: 'User', icon: UserIcon },
};

export default function RoleToggle({ role, onChange }) {
  const { theme } = useThemeColor();

  return (
    <div className="mb-6">
      <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Quick Demo Login</p>
      <div className="relative flex p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
        <motion.div
          className="absolute top-1 bottom-1 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${theme['500']}, ${theme['600']})`,
            width: 'calc(50% - 4px)',
          }}
          animate={{ x: role === 'admin' ? 0 : '100%' }}
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
        />
        {Object.entries(DEMO_ACCOUNTS).map(([key, acc]) => {
          const Icon = acc.icon;
          const active = role === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key, acc)}
              className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold
                          transition-colors duration-200 ${active ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
            >
              <Icon size={15} />
              {acc.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { DEMO_ACCOUNTS };
