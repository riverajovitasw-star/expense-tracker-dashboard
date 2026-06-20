import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = {
  red: { name: 'Red', '500': '#ef4444', '600': '#dc2626', ring: 'rgba(239,68,68,0.4)' },
  blue: { name: 'Blue', '500': '#3b82f6', '600': '#2563eb', ring: 'rgba(59,130,246,0.4)' },
  green: { name: 'Green', '500': '#22c55e', '600': '#16a34a', ring: 'rgba(34,197,94,0.4)' },
  yellow: { name: 'Yellow', '500': '#eab308', '600': '#ca8a04', ring: 'rgba(234,179,8,0.4)' },
};

const STORAGE_KEY = 'loginThemeColor';
const ThemeColorContext = createContext(null);

export function ThemeColorProvider({ children }) {
  const [color, setColor] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored && THEMES[stored] ? stored : 'blue';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, color);
  }, [color]);

  const theme = THEMES[color];

  return (
    <ThemeColorContext.Provider value={{ color, setColor, theme, THEMES }}>
      {children}
    </ThemeColorContext.Provider>
  );
}

export function useThemeColor() {
  const ctx = useContext(ThemeColorContext);
  if (!ctx) throw new Error('useThemeColor must be used within ThemeColorProvider');
  return ctx;
}
