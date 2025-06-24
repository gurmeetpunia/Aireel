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
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
      // Remove the sidebar auto-close on outside click for better UX
    }
    
    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  // Handle sidebar toggle
  const handleToggle = () => {
    onToggle();
  };

  return (
    <>
      {/* Improved backdrop overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleToggle}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 40,
              backdropFilter: 'blur(4px)',
            }}
          />
        )}
      </AnimatePresence>

      <motion.aside
        ref={sidebarRef}
        initial={false}
        animate={{
          x: isOpen ? 0 : 380,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.4
        }}
        style={{
          position: 'fixed',
          top: 72,
          right: 0,
          width: '90vw',
          maxWidth: '380px',
          height: `calc(100vh - 72px)`,
          minWidth: '280px',
          background: 'linear-gradient(135deg, rgba(232,180,160,0.95), rgba(244,210,199,0.90), rgba(232,180,160,0.95))',
          backdropFilter: 'blur(24px)',
          borderTopLeftRadius: '32px',
          borderBottomLeftRadius: '32px',
          borderTopRightRadius: '0',
          borderBottomRightRadius: '0',
          boxShadow: '0 8px 32px 0 rgba(232,180,160,0.2)',
          border: '1.5px solid var(--rose-gold-light)',
          color: 'var(--dark)',
          zIndex: 50,
          overflow: 'hidden',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleToggle}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            zIndex: 100,
            background: 'rgba(255,255,255,0.9)',
            color: 'var(--dark)',
            border: 'none',
            borderRadius: 12,
            padding: 8,
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(232,180,160,0.2)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>

        {/* Sidebar content */}
        <div style={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          paddingTop: 24,
          position: 'relative',
          zIndex: 10
        }}>
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '0 24px', 
            marginBottom: 24 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ 
                padding: 8, 
                background: 'rgba(255,255,255,0.8)', 
                borderRadius: 12, 
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.1)' 
              }}>
                <Sparkles style={{ 
                  width: 18, 
                  height: 18, 
                  color: 'var(--rose-gold-dark)' 
                }} />
              </div>
              <h2 style={{ 
                fontSize: 20, 
                fontWeight: 700, 
                color: 'var(--dark)',
                margin: 0
              }}>
                Your Reels
              </h2>
            </div>
          </div>

          {/* Reels List */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '0 16px',
            paddingBottom: 24
          }}>
            <AnimatePresence>
              {generatingCelebrity && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  style={{
                    marginBottom: 12,
                    padding: 16,
                    background: 'rgba(255,255,255,0.7)',
                    border: '2px dashed var(--rose-gold-light)',
                    borderRadius: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}
                >
                  <div style={{
                    width: 48,
                    height: 64,
                    background: 'rgba(232,180,160,0.2)',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: 24,
                      height: 24,
                      border: '2px solid var(--rose-gold-light)',
                      borderTop: '2px solid var(--rose-gold-dark)',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontWeight: 600, 
                      color: 'var(--dark)', 
                      fontSize: 16, 
                      margin: '0 0 4px 0' 
                    }}>
                      ✨ {generatingCelebrity}
                    </h3>
                    <p style={{ 
                      fontSize: 12, 
                      color: 'var(--rose-gold-dark)', 
                      margin: 0,
                      fontWeight: 500 
                    }}>
                      Creating your reel...
                    </p>
                  </div>
                </motion.div>
              )}

              {loading ? (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: '48px 0' 
                }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    border: '3px solid var(--rose-gold-light)',
                    borderTop: '3px solid var(--rose-gold-dark)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: 16
                  }} />
                  <p style={{ 
                    color: 'var(--dark)', 
                    fontWeight: 500, 
                    margin: 0 
                  }}>
                    Loading your creations...
                  </p>
                </div>
              ) : reels.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '48px 0' 
                }}>
                  <div style={{
                    width: 60,
                    height: 60,
                    margin: '0 auto 16px',
                    background: 'rgba(232,180,160,0.2)',
                    borderRadius: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Sparkles style={{ 
                      width: 30, 
                      height: 30, 
                      color: 'var(--rose-gold-dark)' 
                    }} />
                  </div>
                  <h3 style={{ 
                    fontSize: 18, 
                    fontWeight: 600, 
                    color: 'var(--dark)', 
                    margin: '0 0 8px 0' 
                  }}>
                    Ready to Create?
                  </h3>
                  <p style={{ 
                    color: 'var(--rose-gold-dark)', 
                    fontWeight: 500, 
                    margin: '0 0 16px 0',
                    fontSize: 14
                  }}>
                    Your AI reels will appear here
                  </p>
                  <div style={{ 
                    fontSize: 12, 
                    color: 'var(--dark)',
                    opacity: 0.8
                  }}>
                    🚀 Start by searching for a celebrity!
                  </div>
                </div>
              ) : (
                reels.map((reel, index) => (
                  <motion.div
                    key={reel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onSelect(reel.id)}
                    style={{
                      marginBottom: 12,
                      padding: 16,
                      background: selectedReelId === reel.id 
                        ? 'rgba(180, 120, 100, 0.3)' 
                        : 'rgba(255,255,255,0.7)',
                      border: selectedReelId === reel.id 
                        ? '2px solid var(--rose-gold)' 
                        : '2px solid transparent',
                      borderRadius: 16,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      boxShadow: selectedReelId === reel.id 
                        ? '0 4px 16px 0 rgba(232,180,160,0.2)' 
                        : '0 2px 8px 0 rgba(0,0,0,0.05)',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedReelId !== reel.id) {
                        e.currentTarget.style.background = 'rgba(232,180,160,0.15)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedReelId !== reel.id) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.7)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {reel.thumbnailUrl ? (
                      <div style={{ position: 'relative' }}>
                        <img 
                          src={reel.thumbnailUrl} 
                          alt={reel.celebrity} 
                          style={{ 
                            width: 48, 
                            height: 64, 
                            objectFit: 'cover', 
                            borderRadius: 12,
                            border: '1px solid var(--rose-gold-light)'
                          }}
                        />
                      </div>
                    ) : (
                      <div style={{
                        width: 48,
                        height: 64,
                        background: 'rgba(232,180,160,0.2)',
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Film style={{ 
                          width: 24, 
                          height: 24, 
                          color: 'var(--rose-gold-dark)' 
                        }} />
                      </div>
                    )}
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ 
                        fontWeight: 600, 
                        color: 'var(--dark)', 
                        fontSize: 16,
                        margin: '0 0 4px 0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {reel.celebrity}
                      </h3>
                      <p style={{ 
                        fontSize: 12, 
                        color: 'white', 
                        margin: 0,
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {reel.title}
                      </p>
                      {selectedReelId === reel.id && (
                        <div style={{ 
                          fontSize: 10, 
                          color: 'black', 
                          marginTop: 4, 
                          fontWeight: 600 
                        }}>
                          ✨ Currently viewing
                        </div>
                      )}
                    </div>
                    
                    <div style={{ position: 'relative' }} ref={openMenuId === reel.id ? menuRef : undefined}>
                      <button
                        style={{ 
                          padding: 6, 
                          borderRadius: 8, 
                          background: 'rgba(232,180,160,0.1)', 
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === reel.id ? null : reel.id);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(232,180,160,0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(232,180,160,0.1)';
                        }}
                        aria-label="More actions"
                      >
                        <MoreVertical style={{ 
                          width: 16, 
                          height: 16, 
                          color: 'var(--rose-gold-dark)' 
                        }} />
                      </button>
                      
                      <AnimatePresence>
                        {openMenuId === reel.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            style={{ 
                              position: 'absolute', 
                              right: 0, 
                              top: '100%', 
                              marginTop: 4, 
                              width: 140, 
                              background: 'rgba(255,255,255,0.95)', 
                              border: '1px solid var(--rose-gold-light)', 
                              borderRadius: 12, 
                              boxShadow: '0 8px 24px 0 rgba(0,0,0,0.15)', 
                              zIndex: 100,
                              overflow: 'hidden'
                            }}
                          >
                            <button
                              style={{ 
                                width: '100%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 8, 
                                padding: '10px 12px', 
                                background: 'none', 
                                border: 'none', 
                                color: 'var(--dark)', 
                                fontWeight: 500, 
                                fontSize: 14, 
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(reel.id);
                                setOpenMenuId(null);
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(232,180,160,0.1)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'none';
                              }}
                            >
                              <Trash2 style={{ 
                                width: 14, 
                                height: 14, 
                                color: 'var(--rose-gold-dark)' 
                              }} />
                              Delete Reel
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Add the spin animation styles */}
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </motion.aside>
    </>
  );
};

export default Sidebar;