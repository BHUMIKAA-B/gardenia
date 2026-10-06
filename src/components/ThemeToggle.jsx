import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '', compact = false }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
        isDark
          ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800'
          : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-4 h-4 text-indigo-400 transition-transform duration-200" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 transition-transform duration-200" />
        )}
      </div>
      {!compact && (
        <span className="text-xs font-medium font-mono">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
}
