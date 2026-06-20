import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useThemeColor, THEMES } from '../../context/ThemeColorContext';

export default function ThemeSelector() {
  const { color, setColor } = useThemeColor();

  return (
    <div className="mb-6">
      <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Theme Color</p>
      <div className="flex items-center gap-3">
        {Object.entries(THEMES).map(([key, t]) => {
          const active = color === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setColor(key)}
              aria-label={t.name}
              className="relative flex flex-col items-center gap-1.5 group"
            >
              <motion.span
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.1 }}
                className="relative w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${t['500']}, ${t['600']})`,
                  boxShadow: active ? `0 0 0 3px rgba(255,255,255,0.15), 0 0 16px ${t.ring}` : 'none',
                }}
              >
                {active && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </motion.span>
                )}
              </motion.span>
              <span className={`text-[11px] transition-colors ${active ? 'text-white/80 font-medium' : 'text-white/40 group-hover:text-white/60'}`}>
                {t.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
