// components/Home.tsx (or pages/index.tsx)
import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../app/globals.css';
import ReelCard from './ReelCard';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';


interface Reel {
    id: string;
    title: string;
    celebrity: string;
    videoUrl: string;
    thumbnailUrl: string;
    createdAt: string;
}

const Home: React.FC = () => {
    // Reel logic state
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
    const sidebarButtonRef = useRef<HTMLButtonElement>(null);
    const [sidebarTop, setSidebarTop] = useState(72);

    // Sidebar toggle
    const toggleSidebar = () => setIsSidebarOpen((v) => !v);

    // Fetch reels
    async function fetchReels() {
        setLoading(true);
        try {
            const res = await fetch('/api/reels');
            const data = await res.json();
            setReels(data.reels || []);
        } catch (err) {
            setError('Failed to fetch reels');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchReels();
    }, []);

    useEffect(() => {
        if (sidebarButtonRef.current) {
            const rect = sidebarButtonRef.current.getBoundingClientRect();
            setSidebarTop(rect.top + window.scrollY);
        }
    }, [isSidebarOpen]);

    // Create reel
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
            await fetchReels();
            setCelebrity('');
        } catch (err: any) {
            setError(err.message || 'Failed to generate reel');
        } finally {
            setCreating(false);
            setGeneratingCelebrity(null);
        }
    }

    // Delete reel
    const handleDeleteReel = async (reelId: string) => {
        if (!window.confirm('Are you sure you want to delete this reel?')) return;
        const optimisticReels = reels.filter(r => r.id !== reelId);
        setReels(optimisticReels);
        try {
            const res = await fetch(`/api/reels/${reelId}`, { method: 'DELETE' });
            if (!res.ok) {
                setReels(reels);
                throw new Error((await res.json()).error || 'Failed to delete reel');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to delete reel');
            setReels(reels);
            setTimeout(() => setError(null), 5000);
        }
    };

    // IntersectionObserver for auto-play
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
                            setCurrentIndex(idx);
                            setPlayingIndex(idx);
                        } else {
                            setPlayingIndex(prev => prev === idx ? -1 : prev);
                        }
                    });
                },
                { threshold: 0.6 }
            );
            observer.observe(ref);
            observers.push(observer);
        });
        return () => { observers.forEach(o => o.disconnect()); };
    }, [reels]);

    // Auto-play first reel
    useEffect(() => {
        if (reels.length > 0 && playingIndex === 0) setPlayingIndex(0);
    }, [reels.length]);

    // Play/pause handler
    const handlePlayPause = useCallback((idx: number) => {
        setPlayingIndex(prev => (prev === idx ? -1 : idx));
    }, []);

    // Scroll to reel
    const scrollToReel = useCallback((index: number) => {
        const ref = reelRefs.current[index];
        if (ref) {
            ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, []);

    // Responsive: close sidebar on mobile select
    const handleSidebarSelect = (id: string) => {
        const index = reels.findIndex(reel => reel.id === id);
        if (index !== -1) {
            scrollToReel(index);
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="body">
            {/* Rose gold orbs */}
            <div className="orb orb1"></div>
            <div className="orb orb2"></div>
            <div className="orb orb3"></div>

            {/* Sidebar overlay (not inside header/nav) */}
            <Sidebar
                reels={reels}
                onSelect={handleSidebarSelect}
                onDelete={handleDeleteReel}
                onToggle={toggleSidebar}
                isOpen={isSidebarOpen}
                selectedReelId={reels[currentIndex]?.id}
                loading={loading}
                generatingCelebrity={generatingCelebrity}
            />

            {/* Header with sidebar toggle */}
            <header className="header">
                <nav className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Left: Logo */}
                    <span
                        className="logo"
                        style={{
                            background: 'var(--rose-gold-metallic)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            color: 'unset',
                            fontWeight: 900,
                            fontSize: '2.2rem',
                            letterSpacing: '0.04em',
                            marginRight: 0,
                        }}
                    >
                        ReelAI
                    </span>
                    {/* Right: Sidebar button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button
                            ref={sidebarButtonRef}
                            onClick={toggleSidebar}
                            style={{
                                background: 'var(--rose-gold-metallic)',
                                color: 'var(--dark)',
                                border: 'none',
                                borderRadius: 12,
                                padding: 8,
                                boxShadow: '0 2px 8px 0 rgba(232,180,160,0.10)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 40,
                                height: 40,
                                transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                                overflow: 'hidden',
                                position: 'relative',
                                zIndex: 100,
                            }}
                            aria-label="Open sidebar"
                        >
                            <Menu size={26} />
                        </button>
                    </div>
                </nav>
            </header>

            {/* Main content */}
            <main>
                {/* Error Banner */}
                {error && (
                    <div style={{
                        background: 'rgba(255, 0, 0, 0.1)',
                        color: '#b91c1c',
                        border: '1px solid #fca5a5',
                        borderRadius: 8,
                        padding: '12px 20px',
                        margin: '20px auto',
                        maxWidth: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontWeight: 500,
                        zIndex: 1000,
                    }}>
                        <span>{error}</span>
                        <button
                            onClick={() => setError(null)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#b91c1c',
                                fontWeight: 'bold',
                                fontSize: 18,
                                cursor: 'pointer',
                                marginLeft: 16,
                            }}
                            aria-label="Close error message"
                        >
                            ×
                        </button>
                    </div>
                )}
                {/* Hero and generator */}
                <section className="hero" id="home">
                    <div className="container">
                        <div className="heroContent">
                            <h1 className="heroTitle"> ReelAI </h1>
                            <p className="subtitle">NEXT-GEN SPORTS REELS</p>
                            <p className="description">Transform any sports legend into viral content with cutting-edge AI technology. Enter a name, witness the revolution.</p>
                        </div>
                        <form className="generator" onSubmit={handleCreateReel}>
                            <div className="generatorContent">
                                <h2 className="generatorHeading">Generate Reel</h2>
                                <div className="inputGroup">
                                    <label htmlFor="celebrity-name">Sports Celebrity Name</label>
                                    <input
                                        type="text"
                                        id="celebrity-name"
                                        className="celebrityInput"
                                        placeholder="Cristiano Ronaldo, LeBron James, Serena Williams..."
                                        autoComplete="off"
                                        value={celebrity}
                                        onChange={e => setCelebrity(e.target.value)}
                                        disabled={creating}
                                    />
                                </div>
                                <button
                                    className="generateBtn"
                                    type="submit"
                                    disabled={creating}
                                    style={{ background: 'var(--rose-gold-metallic)' }}
                                >
                                    {creating ? '🔄 Processing...' : '⚡ Generate Reel'}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                {/* Trending athletes */}
                <section className="popularCelebrities">
                    <div className="container">
                        <h2 className="popularCelebritiesHeading">Trending Athletes</h2>
                        <div className="celebrityTags">
                            {["Lionel Messi","Michael Jordan","Tom Brady","Usain Bolt","Roger Federer","Kobe Bryant","Neymar Jr","Lewis Hamilton","Virat Kohli","Stephen Curry"].map(name => (
                                <span
                                    key={name}
                                    className="celebrityTag"
                                    onClick={() => setCelebrity(name)}
                                    style={{ background: 'var(--rose-gold-metallic)', color: '#fff', cursor: 'pointer' }}
                                >
                                    {name}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Reel feed */}
                <section style={{ position: 'relative', width: '100vw', maxWidth: '100vw', overflow: 'hidden', padding: 0, margin: 0 }}>
                    <div>
                        <h2 className="featuresHeading" style={{ marginBottom: 50, marginTop: 50 }}>Your Reels</h2>
                    </div>
                    <div
                        style={{
                            height: reels.length === 0 ? 'auto' : '100vh', // <--- IMPORTANT CHANGE HERE
                            width: '100vw',
                            maxWidth: '100vw',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            scrollSnapType: 'y mandatory',
                            WebkitOverflowScrolling: 'touch',
                            position: 'relative',
                        }}
                    >
                        {loading ? (
                            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rose-gold)' }}>Loading reels...</div>
                        ) : reels.length === 0 ? (
                            // Only apply minimal styling to this div
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--rose-gold)',
                                padding: '50px 20px', // Add some padding for visual comfort
                                textAlign: 'center', // Center the text
                                minHeight: '100px', // Give it a minimum height if you want it to always be somewhat visible
                                                    // otherwise, remove this line and let it completely auto-adjust.
                            }}>
                                No reels yet. Create your first above!
                            </div>
                        ) : (
                            reels.map((reel, idx) => (
                                <div
                                    key={reel.id}
                                    ref={el => { reelRefs.current[idx] = el; }}
                                    style={{
                                        minHeight: '100vh', // This ensures each reel takes up the full viewport height
                                        width: '100vw',
                                        maxWidth: '100vw',
                                        overflowX: 'hidden',
                                        scrollSnapAlign: 'start',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'rgba(232,180,160,0.04)',
                                        position: 'relative',
                                    }}
                                >
                                    <div
                                        style={{
                                            height: '100vh',
                                            width: '100vw',
                                            overflow: 'auto',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
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
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Features section (unchanged) */}
                <section className="features" id="features">
                    <div className="container">
                        <h2 className="featuresHeading">Advanced Technology</h2>
                        <div className="featuresGrid responsive-features-grid" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
                            <div className="features-row" style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
                                {/* First row: 3 cards */}
                                <div className="featureCard responsive-feature-card" style={{ width: 320, minHeight: 280 }}>
                                    <div className="featureIcon">⚡</div>
                                    <h3>Instant Generation</h3>
                                    <p>Render professional-grade reels in under a minute. No editing skills required - just pure AI-powered content creation.</p>
                                </div>
                                <div className="featureCard responsive-feature-card" style={{ width: 320, minHeight: 280 }}>
                                    <div className="featureIcon">🎯</div>
                                    <h3>Algorithm Optimized</h3>
                                    <p>Built specifically for social media algorithms with optimal aspect ratios, engagement hooks, and viral formatting techniques.</p>
                                </div>
                                <div className="featureCard responsive-feature-card" style={{ width: 320, minHeight: 280 }}>
                                    <div className="featureIcon">🌐</div>
                                    <h3>Global Sports Database</h3>
                                    <p>Comprehensive knowledge spanning football, basketball, tennis, cricket, motorsports, and 50+ other international sports.</p>
                                </div>
                            </div>
                            <div className="features-row" style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
                                {/* Second row: 2 cards, centered */}
                                <div className="featureCard responsive-feature-card" style={{ width: 320, minHeight: 280 }}>
                                    <div className="featureIcon">📱</div>
                                    <h3>Multi-Platform Export</h3>
                                    <p>Automatically formatted for TikTok, Instagram Reels, YouTube Shorts, and other platforms with platform-specific optimizations.</p>
                                </div>
                                <div className="featureCard responsive-feature-card" style={{ width: 320, minHeight: 280 }}>
                                    <div className="featureIcon">🎨</div>
                                    <h3>Dynamic Styling</h3>
                                    <p>Choose from cinematic, energetic, documentary, or highlight styles with automatic music synchronization and visual effects.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="footer">
                <div className="footerRow">
                    <span className="footerText">&copy; 2025 ReelAI. All rights reserved.</span>
                    <div className="footerLinks">
                        <a href="https://www.linkedin.com/in/gurmeet-756279235/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="footerIconLink">
                            <svg className="footerIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 8a6 6 0 0 1 6 6v5.25a.75.75 0 0 1-.75.75h-3.5a.75.75 0 0 1-.75-.75V14a2 2 0 0 0-4 0v5.25a.75.75 0 0 1-.75.75h-3.5A.75.75 0 0 1 8 19.25V9.75A.75.75 0 0 1 8.75 9h3.5a.75.75 0 0 1 .75.75v.75a6 6 0 0 1 3-2.5zM2.75 9A.75.75 0 0 1 3.5 9h3.5a.75.75 0 0 1 .75.75v9.5a.75.75 0 0 1-.75.75H3.5a.75.75 0 0 1-.75-.75v-9.5zM5.25 6.5a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </a>
                        <a href="http://github.com/gurmeetpunia/" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="footerIconLink">
                            <svg className="footerIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.36.31.68.921.68 1.857 0 1.34-.012 2.422-.012 2.753 0 .267.18.577.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;