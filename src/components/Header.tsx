'use client';

import React from 'react';
import { Search, Sparkles, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface HeaderProps {
  onSearch: (e: React.FormEvent) => void;
  celebrity: string;
  setCelebrity: (v: string) => void;
  creating: boolean;
}

const Header: React.FC<HeaderProps> = ({ onSearch, celebrity, setCelebrity, creating }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="relative z-10 bg-[var(--card-background)] border-b border-[var(--border-color)] p-4 shadow-sm transition-colors duration-300">
      <div className="container mx-auto flex items-center justify-between gap-6">
        {/* Left Side: Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">AI Reels</h1>
            <p className="text-sm text-[var(--secondary-text)] hidden md:block">Create & Manage</p>
          </div>
        </div>

        {/* Middle: Search Form */}
        <div className="flex-1 max-w-lg">
          <form onSubmit={onSearch} className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--secondary-text)] w-5 h-5" />
            <input
              type="text"
              className="w-full pl-11 pr-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-[var(--foreground)] placeholder-[var(--secondary-text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
              placeholder="Search for a celebrity to create a reel..."
              value={celebrity}
              onChange={(e) => setCelebrity(e.target.value)}
              disabled={creating}
            />
          </form>
        </div>

        {/* Right Side: Dark Mode Toggle */}
        <div className="flex items-center">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-[var(--background)] hover:bg-[var(--border-color)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-6 h-6 text-yellow-400" />
            ) : (
              <Moon className="w-6 h-6 text-[var(--primary)]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 