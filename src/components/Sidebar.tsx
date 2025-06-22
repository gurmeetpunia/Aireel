import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, X, MoreVertical, Trash2, Sparkles, Film, Zap, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  reels: any[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: () => void;
  isOpen: boolean;
  selectedReelId?: string;
  loading: boolean;
  generatingCelebrity: string | null;
  onSearch: (e: React.FormEvent) => void;
  celebrity: string;
  setCelebrity: (v: string) => void;
  creating: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  reels, 
  onSelect, 
  onDelete, 
  onToggle,
  isOpen,
  selectedReelId,
  loading,
  generatingCelebrity,
  onSearch,
  celebrity,
  setCelebrity,
  creating
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    }
    
    if (openMenuId || mobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId, mobileOpen]);

  // Close sidebar when selecting a reel on mobile
  const handleMobileSelect = (id: string) => {
    onSelect(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Enhanced Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-[100] group overflow-hidden"
        aria-label={mobileOpen ? 'Close sidebar' : 'Open sidebar'}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-2xl transition-all duration-300 group-hover:scale-110"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
        
        <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white rounded-2xl p-3 shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300/50 transition-all duration-300 transform group-hover:scale-105 active:scale-95">
          <div className="relative z-10">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </div>
        </div>
      </button>

      {/* Enhanced Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60 backdrop-blur-md z-40 transition-all duration-500 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Enhanced Sidebar */}
      <aside
        ref={sidebarRef}
        className={`z-50 fixed md:relative top-0 left-0 h-full w-full max-w-sm md:w-72 transition-all duration-500 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isOpen ? 'md:translate-x-0' : 'md:-translate-x-full'}`}
      >
        {/* Sidebar background with glassmorphism */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--card-background)]/95 via-[var(--card-background)]/90 to-[var(--card-background)]/95 backdrop-blur-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5"></div>
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/30 to-transparent"></div>
        
        <div className="relative h-full flex flex-col pt-6">
          {/* Search Form moved from Header */}
          <div className="px-6 mb-4">
            <form onSubmit={onSearch} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-[var(--background)]/80 backdrop-blur-sm border border-[var(--border-color)]/50 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
                {!creating ? (
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--secondary-text)] w-6 h-6 group-hover:text-[var(--primary)] transition-colors duration-300" />
                ) : (
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6">
                    <div className="w-6 h-6 border-3 border-gradient-to-r from-purple-500 via-pink-500 to-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </form>
          </div>
          {/* Enhanced Header */}
          <div className="flex justify-between items-center px-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-xl shadow-lg">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <h2 className="text-xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Your Reels
              </h2>
            </div>
            <button 
              onClick={onToggle} 
              className="hidden md:block p-2 rounded-xl hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300 group border border-[var(--border-color)]/30"
              aria-label="Toggle sidebar"
            >
              <X className="w-5 h-5 text-[var(--secondary-text)] group-hover:text-[var(--primary)] transition-colors duration-300" />
            </button>
          </div>

          {/* Enhanced Reels List */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
            <AnimatePresence>
              {generatingCelebrity && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -50, scale: 0.8 }}
                  className="group relative rounded-2xl bg-gradient-to-br from-[var(--background)]/80 to-[var(--background)]/60 backdrop-blur-sm border-2 border-dashed border-purple-500/50 mb-3 p-4 overflow-hidden"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/5 to-transparent blur-xl"></div>
                  
                  <div className="relative flex items-center gap-4">
                    <div className="w-14 h-18 flex-shrink-0 bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-blue-900/50 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm border border-purple-500/20">
                      <div className="relative">
                        <div className="w-7 h-7 border-3 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                        <Zap className="absolute inset-0 w-7 h-7 text-yellow-400/80 animate-pulse" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[var(--foreground)] truncate text-lg">
                        ✨ {generatingCelebrity}
                      </h3>
                      <p className="text-sm text-purple-400 truncate mt-1 animate-pulse font-medium">
                        🎬 Crafting magic...
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    <div className="w-12 h-12 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 w-12 h-12 border-3 border-pink-500/20 border-r-pink-500 rounded-full animate-spin animate-reverse" style={{ animationDelay: '0.5s' }} />
                  </div>
                  <p className="text-[var(--secondary-text)] mt-4 animate-pulse">Loading your creations...</p>
                </div>
              ) : reels.length === 0 ? (
                <div className="text-center py-12">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-purple-500/20">
                      <Sparkles className="w-10 h-10 text-purple-400 animate-pulse" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Ready to Create?</h3>
                  <p className="text-[var(--secondary-text)] font-medium">Your AI reels will appear here</p>
                  <div className="mt-4 text-sm text-purple-400">🚀 Start by searching for a celebrity!</div>
                </div>
              ) : (
                reels.map((reel, index) => (
                  <motion.div
                    key={reel.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 0.8, transition: { duration: 0.3 } }}
                    transition={{ delay: index * 0.05 }}
                    className={`group relative rounded-2xl cursor-pointer transition-all duration-300 mb-3 overflow-visible ${
                      selectedReelId === reel.id 
                        ? 'bg-gradient-to-br from-purple-500/25 via-pink-500/20 to-blue-500/25 border-2 border-purple-500/60 shadow-2xl shadow-purple-500/20 scale-[1.02]' 
                        : 'bg-gradient-to-br from-[var(--background)]/80 to-[var(--background)]/60 hover:from-purple-500/10 hover:to-pink-500/10 border-2 border-transparent hover:border-purple-500/30 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-500/10 hover:scale-[1.01]'
                    }`}
                    onClick={() => handleMobileSelect(reel.id)}
                  >
                    {/* Animated background for selected item */}
                    {selectedReelId === reel.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 animate-pulse"></div>
                    )}
                    
                    <div className="relative flex items-center gap-4 p-4">
                      {reel.thumbnailUrl ? (
                        <div className="relative">
                          <img 
                            src={reel.thumbnailUrl} 
                            alt={reel.celebrity} 
                            className="w-14 h-18 object-cover rounded-xl flex-shrink-0 shadow-lg border-2 border-purple-500/20" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent rounded-xl"></div>
                          <Star className="absolute top-1 right-1 w-4 h-4 text-yellow-400 drop-shadow-lg" />
                        </div>
                      ) : (
                        <div className="w-14 h-18 flex-shrink-0 bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-blue-900/50 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm border-2 border-purple-500/20">
                          <Film className="w-7 h-7 text-purple-400" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[var(--foreground)] truncate text-lg group-hover:text-purple-400 transition-colors duration-300">
                          {reel.celebrity}
                        </h3>
                        <p className="text-sm text-[var(--secondary-text)] truncate mt-1 font-medium">
                          {reel.title}
                        </p>
                        {selectedReelId === reel.id && (
                          <div className="text-xs text-purple-400 mt-1 font-medium">✨ Currently viewing</div>
                        )}
                      </div>
                      
                      <div className="relative overflow-visible" ref={openMenuId === reel.id ? menuRef : undefined}>
                        <button
                          className="p-2 rounded-xl hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300 group border border-transparent hover:border-purple-500/30"
                          onClick={e => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === reel.id ? null : reel.id);
                          }}
                          aria-label="More actions"
                        >
                          <MoreVertical className="w-5 h-5 text-[var(--secondary-text)] group-hover:text-purple-400 transition-colors duration-300" />
                        </button>
                        
                        <AnimatePresence>
                          {openMenuId === reel.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: -10 }}
                              className="absolute right-0 top-full mt-2 w-44 bg-[var(--card-background)]/95 backdrop-blur-xl border border-[var(--border-color)]/50 rounded-2xl shadow-2xl z-50 overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-600/5"></div>
                              <button
                                className="relative w-full flex items-center gap-3 px-4 py-3 text-left text-white-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 font-medium"
                                onClick={e => {
                                  e.stopPropagation();
                                  onDelete(reel.id);
                                  setOpenMenuId(null);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Reel
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;