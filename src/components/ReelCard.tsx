import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Heart, User, Clock, Sparkles, RefreshCw, AlertCircle, Zap, Eye } from 'lucide-react';

interface ReelCardProps {
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  celebrity: string;
  createdAt: string;
  isPlaying?: boolean;
  isMuted?: boolean;
}

const LoadingSpinner: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xl">
    <div className="relative">
      {/* Multi-layered spinning rings */}
      <div className="w-16 h-16 border-4 border-transparent border-t-purple-500 border-r-pink-500 rounded-full animate-spin"></div>
      <div className="absolute inset-2 w-12 h-12 border-4 border-transparent border-t-blue-500 border-l-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      <div className="absolute inset-4 w-8 h-8 border-4 border-transparent border-t-pink-500 border-b-blue-500 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
      
      {/* Center spark */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
    </div>
    
    <div className="absolute bottom-20 text-center">
      <p className="font-semibold text-lg bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
        ✨ Loading Magic...
      </p>
    </div>
  </div>
);

const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-xl">
    <div className="text-center p-8 bg-gradient-to-br from-red-500/10 via-orange-500/10 to-pink-500/10 rounded-3xl border border-red-500/20 backdrop-blur-sm">
      <div className="relative mb-6">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-lg"></div>
      </div>
      
      <p className="text-white text-lg font-semibold mb-2">Oops! Something went wrong</p>
      <p className="text-slate-300 text-sm mb-6">Failed to load this masterpiece</p>
      
      <button
        onClick={onRetry}
        className="relative group px-6 py-3 bg-gradient-to-r from-red-600 via-orange-600 to-pink-600 hover:from-red-500 hover:via-orange-500 hover:to-pink-500 text-white rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-500/50"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 via-orange-400/20 to-pink-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center gap-2">
          <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          Try Again
        </div>
      </button>
    </div>
  </div>
);

const PlayPauseButton: React.FC<{
  isPlaying: boolean;
  onPlayPause: () => void;
  showControls: boolean;
}> = ({ isPlaying, onPlayPause, showControls }) => (
  <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
    showControls ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
  }`}>
    <button
      className="relative group bg-black/40 backdrop-blur-xl rounded-full p-6 border-2 border-white/20 transition-all duration-300 hover:bg-black/60 hover:scale-110 hover:border-purple-500/50 active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-500/50 shadow-2xl"
      onClick={(e) => {
        e.stopPropagation();
        onPlayPause();
      }}
      aria-label={isPlaying ? "Pause video" : "Play video"}
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Button content */}
      <div className="relative">
        {isPlaying ? (
          <Pause className="w-10 h-10 text-white group-hover:text-purple-300 transition-colors duration-300" />
        ) : (
          <Play className="w-10 h-10 text-white group-hover:text-purple-300 transition-colors duration-300 ml-1" />
        )}
      </div>
      
      {/* Pulse effect when playing */}
      {isPlaying && (
        <div className="absolute inset-0 rounded-full border-4 border-purple-500/30 animate-ping"></div>
      )}
    </button>
  </div>
);

const ReelCard: React.FC<ReelCardProps> = ({ 
  videoUrl, 
  thumbnailUrl, 
  title, 
  celebrity, 
  createdAt, 
  isPlaying = false,
  isMuted = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [viewCount] = useState(Math.floor(Math.random() * 10000) + 1000);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      setVideoLoading(true);
      setVideoError(false);
    };

    const handleCanPlay = () => {
      setVideoLoading(false);
      setVideoError(false);
    };

    const handleError = () => {
      setVideoLoading(false);
      setVideoError(true);
    };

    const handlePlay = () => setIsVideoPlaying(true);
    const handlePause = () => setIsVideoPlaying(false);

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration && !isNaN(video.duration)) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', updateProgress);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadedmetadata', updateProgress);
    };
  }, []);

  // Video playback control based on isPlaying prop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.currentTime = 0;
      video.play().catch(() => console.warn("Autoplay failed"));
    } else {
      video.pause();
    }
  }, [isPlaying]);

  const handleMouseEnter = useCallback(() => setShowControls(true), []);
  const handleMouseLeave = useCallback(() => setShowControls(false), []);
  const handleLike = useCallback(() => {
    setLiked(prev => !prev);
  }, []);

  const handleRetry = useCallback(() => {
    setVideoError(false);
    setVideoLoading(true);
    videoRef.current?.load();
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  }, []);

  const formatViews = useCallback((views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center bg-transparent p-3">
      <div
        className="relative w-full max-w-xs md:w-[380px] h-full rounded-3xl overflow-hidden group transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Enhanced background blur effect */}
        <div
          className="absolute inset-0 scale-110 blur-3xl opacity-40 transition-opacity duration-500 group-hover:opacity-60"
          style={{ backgroundImage: `url(${thumbnailUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        
        {/* Multiple gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Main card container with glassmorphism */}
        <div className="relative w-full h-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Animated border gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
          <div className="absolute inset-px bg-black rounded-3xl"></div>

          <video
            ref={videoRef}
            className="relative w-full h-full object-cover cursor-pointer rounded-3xl transition-transform duration-300 group-hover:scale-[1.01]"
            src={videoUrl}
            poster={thumbnailUrl}
            controls={false}
            loop
            playsInline
            muted={isMuted}
            preload="metadata"
            onClick={() => {
              const video = videoRef.current;
              if (video) {
                if (isVideoPlaying) {
                  video.pause();
                } else {
                  video.play().catch(() => console.warn("Autoplay failed"));
                }
              }
            }}
          />

          {videoLoading && <LoadingSpinner />}
          {videoError && <ErrorState onRetry={handleRetry} />}

          <PlayPauseButton
            isPlaying={isVideoPlaying}
            showControls={showControls}
            onPlayPause={() => {
              const video = videoRef.current;
              if (video) {
                if (isVideoPlaying) {
                  video.pause();
                } else {
                  video.play().catch(() => console.warn("Autoplay failed"));
                }
              }
            }}
          />

          {/* Enhanced header with celebrity info */}
          <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
            <div className="flex items-center gap-4 group/header">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover/header:shadow-xl transition-all duration-300 group-hover/header:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 rounded-full blur opacity-0 group-hover/header:opacity-40 transition-opacity duration-300"></div>
                  <User className="relative w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-lg truncate bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text group-hover/header:from-purple-300 group-hover/header:via-pink-300 group-hover/header:to-blue-300 transition-all duration-300">
                  {celebrity}
                </h3>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
                  <span className="font-medium">Verified Creator</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/10 backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transition-all duration-300 shadow-lg relative overflow-hidden" 
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
            </div>
          </div>

          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl"></div>
          
          {/* Outer glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 rounded-3xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500 -z-10"></div>
        </div>
      </div>
    </div>
  );
};

export default ReelCard;