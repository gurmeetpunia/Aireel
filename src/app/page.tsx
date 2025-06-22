"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import ReelCard from '@/components/ReelCard';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import { ChevronUp, ChevronDown, Menu } from 'lucide-react';

interface Reel {
  id: string;
  title: string;
  celebrity: string;
  videoUrl: string;
  thumbnailUrl: string;
  createdAt: string;
}

export default function ReelFeed() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [generatingCelebrity, setGeneratingCelebrity] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [celebrity, setCelebrity] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  async function fetchReels() {
    setLoading(true);
    try {
      const res = await fetch('/api/reels');
      const data = await res.json();
      setReels(data.reels || []);
    } catch (err) {
      console.error('Failed to fetch reels:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReels();
  }, []);

  async function handleCreateReel(e: React.FormEvent) {
    e.preventDefault();
    if (!celebrity.trim()) return;
    setCreating(true);
    setGeneratingCelebrity(celebrity);
    setError(null);
    try {
      const res = await fetch('/api/reels/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ celebrity }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to generate reel');
      
      // Reload the page to get the latest state
      window.location.reload();

    } catch (err: any) {
      setError(err.message || 'Failed to generate reel');
    } finally {
      setCreating(false);
      setGeneratingCelebrity(null);
    }
  }

  const handleDeleteReel = async (reelId: string) => {
    if (!window.confirm('Are you sure you want to delete this reel?')) {
      return;
    }

    // Immediately remove the reel from the state for a responsive UI
    const optimisticReels = reels.filter(r => r.id !== reelId);
    setReels(optimisticReels);

    try {
      const res = await fetch(`/api/reels/${reelId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        // If the API call fails, revert the state
        setReels(reels);
        throw new Error((await res.json()).error || 'Failed to delete reel');
      }
      // No need to fetch again, the optimistic update is now confirmed
    } catch (err: any) {
      setError(err.message || 'Failed to delete reel');
      // Revert state on error
      setReels(reels);
      setTimeout(() => setError(null), 5000);
    }
  };

  // IntersectionObserver to track which reel is in view and auto-play
  useEffect(() => {
    if (reels.length === 0) return;

    const observers: IntersectionObserver[] = [];
    reelRefs.current = reelRefs.current.slice(0, reels.length);

    reels.forEach((_, idx) => {
      const ref = reelRefs.current[idx];
      if (!ref) return;

      const observer = new window.IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // This reel is now in view
              setCurrentIndex(idx);
              setPlayingIndex(idx); // Auto-play this reel
            } else {
              // This reel is out of view, pause it
              // No need to check playingIndex, just pause if not intersecting
              setPlayingIndex(prev => prev === idx ? -1 : prev);
            }
          });
        },
        { 
          threshold: 0.6
        }
      );
      
      observer.observe(ref);
      observers.push(observer);
    });

    return () => {
      observers.forEach(o => o.disconnect());
    };
  }, [reels]);

  // Auto-play the first reel when page loads
  useEffect(() => {
    if (reels.length > 0 && playingIndex === 0) {
      setPlayingIndex(0);
    }
  }, [reels.length]);

  // Play/pause handler for individual reels
  const handlePlayPause = useCallback((idx: number) => {
    setPlayingIndex(prev => (prev === idx ? -1 : idx));
  }, []);

  // Scroll to specific reel
  const scrollToReel = useCallback((index: number) => {
    const ref = reelRefs.current[index];
    if (ref) {
      ref.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events if the target is an input, textarea, or select element
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }

      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const newIndex = Math.max(currentIndex - 1, 0);
        scrollToReel(newIndex);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const newIndex = Math.min(currentIndex + 1, reels.length - 1);
        scrollToReel(newIndex);
      } else if (e.key === ' ') {
        e.preventDefault();
        handlePlayPause(currentIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, reels.length, scrollToReel, handlePlayPause]);

  return (
    <div className="flex h-screen w-full bg-background font-orbitron">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:block"
          >
            <Sidebar
              isOpen={isSidebarOpen}
              onToggle={toggleSidebar}
              reels={reels}
              onSelect={(id) => {
                const index = reels.findIndex(reel => reel.id === id);
                if (index !== -1) {
                  scrollToReel(index);
                }
              }}
              onDelete={handleDeleteReel}
              selectedReelId={reels[currentIndex]?.id}
              loading={loading}
              generatingCelebrity={generatingCelebrity}
              onSearch={handleCreateReel}
              celebrity={celebrity}
              setCelebrity={setCelebrity}
              creating={creating}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-1/2 -translate-y-1/2 left-0 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-r-2xl p-4 pl-3 shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>
      )}
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen max-h-screen overflow-hidden">
        {/* Error message display */}
        {error && (
          <div className="mx-auto my-4 px-6 py-3 bg-red-600 text-white rounded-xl shadow-lg text-center font-semibold max-w-md animate-pulse z-50">
            {error}
          </div>
        )}
        
        {/* Reel Feed */}
        <div className="flex-1 relative overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white text-lg">Loading reels...</p>
              </div>
            </div>
          ) : reels.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🎬</span>
                </div>
                <h2 className="text-white text-xl font-bold mb-2">No reels yet</h2>
                <p className="text-gray-400">Use the search bar above to create your first reel!</p>
              </div>
            </div>
          ) : (
            <>
              <div 
                ref={containerRef}
                className="h-full overflow-y-auto scroll-smooth snap-y snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as any}
              >
                <div className="flex flex-col items-center w-full h-full">
                  {reels.map((reel, idx) => (
                    <div
                      key={reel.id}
                      ref={el => { reelRefs.current[idx] = el; }}
                      className="w-full min-h-screen flex justify-center items-center snap-start snap-always"
                    >
                      <ReelCard
                        videoUrl={reel.videoUrl}
                        thumbnailUrl={reel.thumbnailUrl}
                        title={reel.title}
                        celebrity={reel.celebrity}
                        createdAt={reel.createdAt}
                        isPlaying={playingIndex === idx}
                        isMuted={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Scroll Indicators */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                <button 
                  onClick={() => scrollToReel(Math.max(currentIndex - 1, 0))}
                  disabled={currentIndex === 0}
                  className="p-2 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronUp className="w-5 h-5 text-white" />
                </button>
                <div className="h-20 w-px bg-white/20" />
                <button 
                  onClick={() => scrollToReel(Math.min(currentIndex + 1, reels.length - 1))}
                  disabled={currentIndex === reels.length - 1}
                  className="p-2 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-5 h-5 text-white" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}