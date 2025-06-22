import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, X, MoreVertical, Trash2, Sparkles, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  reels: any[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: () => void;
  isOpen: boolean;
  selectedReelId?: string;
  loading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  reels, 
  onSelect, 
  onDelete, 
  onToggle,
  isOpen,
  selectedReelId,
  loading, 
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
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-[100] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl p-4 shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300 transform hover:scale-105 active:scale-95"
        aria-label={mobileOpen ? 'Close sidebar' : 'Open sidebar'}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`z-50 fixed md:relative top-0 left-0 h-full w-full max-w-sm md:w-80 bg-[var(--card-background)] border-r border-[var(--border-color)] shadow-lg transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isOpen ? 'md:translate-x-0' : 'md:-translate-x-full'}`}
      >
        <div className="relative h-full flex flex-col pt-6">
          <div className="flex justify-between items-center px-6 mb-4">
            <h2 className="text-lg font-bold text-[var(--foreground)]">Generated Reels</h2>
            <button 
              onClick={onToggle} 
              className="hidden md:block p-2 rounded-full hover:bg-[var(--border-color)] transition-colors"
              aria-label="Toggle sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Reels List */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 scrollbar-thin scrollbar-thumb-[var(--border-color)] scrollbar-track-[var(--background)]">
            <AnimatePresence>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                </div>
              ) : reels.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-base md:text-lg">No reels yet</p>
                  <p className="text-sm">Create your first AI reel!</p>
                </div>
              ) : (
                reels.map((reel) => (
                  <motion.div
                    key={reel.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                    className={`group relative rounded-xl cursor-pointer transition-all duration-200 mb-2 ${
                      selectedReelId === reel.id 
                        ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-2 border-purple-500/80 shadow-lg shadow-purple-500/10' 
                        : 'bg-[var(--background)] hover:bg-[var(--border-color)] border-2 border-transparent hover:border-[var(--primary)]'
                    }`}
                    onClick={() => handleMobileSelect(reel.id)}
                  >
                    <div className="flex items-center gap-4 p-3">
                      {reel.thumbnailUrl ? (
                        <img src={reel.thumbnailUrl} alt={reel.celebrity} className="w-12 h-16 object-cover rounded-md flex-shrink-0 bg-slate-700" />
                      ) : (
                        <div className="w-12 h-16 flex-shrink-0 bg-slate-700 rounded-md flex items-center justify-center">
                          <Film className="w-6 h-6 text-slate-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[var(--foreground)] truncate text-base">
                          {reel.celebrity}
                        </h3>
                        <p className="text-sm text-[var(--secondary-text)] truncate mt-1">
                          {reel.title}
                        </p>
                      </div>
                      
                      <div className="relative" ref={openMenuId === reel.id ? menuRef : undefined}>
                        <button
                          className="p-2 rounded-full hover:bg-[var(--border-color)] transition-colors"
                          onClick={e => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === reel.id ? null : reel.id);
                          }}
                          aria-label="More actions"
                        >
                          <MoreVertical className="w-5 h-5 text-[var(--secondary-text)]" />
                        </button>
                        
                        {openMenuId === reel.id && (
                          <div className="absolute right-0 top-full mt-2 w-40 bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg shadow-xl z-50 overflow-hidden">
                            <button
                              className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-500 hover:bg-red-500/10 transition-colors"
                              onClick={e => {
                                e.stopPropagation();
                                onDelete(reel.id);
                                setOpenMenuId(null);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
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