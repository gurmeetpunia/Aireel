'use client';

import React from 'react';
import { Search, Sparkles, Sun, Moon, Zap } from 'lucide-react';
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
    <header className="relative z-10 backdrop-blur-xl bg-gradient-to-r from-[var(--card-background)]/80 to-[var(--card-background)]/60 border-b border-[var(--border-color)]/30 shadow-2xl transition-all duration-500">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 animate-pulse"></div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--primary)]/5 to-transparent blur-xl"></div>
      
      <div className="relative container mx-auto flex items-center justify-between gap-6 p-6">
        {/* Left Side: Enhanced Logo and Title */}
        <div className="flex items-center gap-4 group">
          <div className="relative p-3 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <Sparkles className="relative w-7 h-7 text-white animate-pulse" />
          </div>
          <div className="group-hover:translate-x-1 transition-transform duration-300">
            <h1 className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              AI Reels
            </h1>
            <p className="text-sm text-[var(--secondary-text)] font-medium tracking-wide hidden md:block">
              Create & Dominate
            </p>
          </div>
        </div>

        {/* Middle: Sexy Search Form */}
        <div className="flex-1 max-w-2xl">
          <form onSubmit={onSearch} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative bg-[var(--background)]/80 backdrop-blur-sm border border-[var(--border-color)]/50 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
              {!creating ? (
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--secondary-text)] w-6 h-6 group-hover:text-[var(--primary)] transition-colors duration-300" />
              ) : (
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6">
                  <div className="w-6 h-6 border-3 border-gradient-to-r from-purple-500 via-pink-500 to-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <Zap className="absolute inset-0 w-6 h-6 text-yellow-400 animate-pulse" />
                </div>
              )}
              
              <input
                type="text"
                className="w-full pl-14 pr-6 py-4 bg-transparent text-[var(--foreground)] placeholder-[var(--secondary-text)] focus:outline-none focus:placeholder-[var(--primary)] transition-all duration-300 text-lg font-medium"
                placeholder={creating ? "✨ Crafting your viral masterpiece..." : "🔥 Enter celebrity name to create magic..."}
                value={celebrity}
                onChange={(e) => setCelebrity(e.target.value)}
                disabled={creating}
              />
              
              {/* Animated border gradient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </form>
        </div>

        {/* Right Side: Enhanced Dark Mode Toggle */}
        <div className="flex items-center">
          <button
            onClick={toggleTheme}
            className="relative p-3 rounded-2xl bg-[var(--background)]/80 hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300 focus:outline-none group shadow-lg hover:shadow-xl border border-[var(--border-color)]/30"
            aria-label="Toggle dark mode"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {theme === 'dark' ? (
              <Sun className="relative w-7 h-7 text-yellow-400 group-hover:rotate-180 transition-transform duration-500 drop-shadow-lg" />
            ) : (
              <Moon className="relative w-7 h-7 text-[var(--primary)] group-hover:rotate-12 transition-transform duration-500 drop-shadow-lg" />
            )}
            
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/20 to-purple-500/20 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
    </header>
  );
};

export default Header;