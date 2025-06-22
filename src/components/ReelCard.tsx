import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Heart, User, Clock, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

interface ReelCardProps {
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  celebrity: string;
  createdAt: string;
  isPlaying?: boolean;
  isMuted?: boolean;
}

// Particle effect
const ParticleOverlay: React.FC = () => {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 4,
    size: 2 + Math.random() * 4,
    opacity: 0.1 + Math.random() * 0.3,
    duration: 3 + Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

const LoadingSpinner: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
    </div>
  </div>
);

const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
    <div className="text-center p-6">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <p className="text-white text-sm mb-4">Failed to load video</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
      >
        <RefreshCw className="w-4 h-4" />
        Retry
      </button>
    </div>
  </div>
);

const PlayPauseButton: React.FC<{
  isPlaying: boolean;
  onPlayPause: () => void;
  showControls: boolean;
}> = ({ isPlaying, onPlayPause, showControls }) => (
  <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
    showControls ? 'opacity-100' : 'opacity-0'
  }`}>
    <button
      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md rounded-full p-4 border-2 border-white/30 transition-all duration-300 hover:bg-black/80 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
      onClick={(e) => {
        e.stopPropagation();
        onPlayPause();
      }}
      aria-label={isPlaying ? "Pause video" : "Play video"}
    >
      {isPlaying ? (
        <Pause className="w-8 h-8 text-white" />
      ) : (
        <Play className="w-8 h-8 text-white ml-1" />
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

  return (
    <div className="w-full h-full flex items-center justify-center bg-transparent p-2">
      <div
        className="relative w-full max-w-xs md:w-[360px] h-full max-h-[80vh] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-black group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="absolute inset-0 scale-110 blur-2xl opacity-30"
          style={{ backgroundImage: `url(${thumbnailUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-blue-900/10" />
        <ParticleOverlay />

        <video
          ref={videoRef}
          className="w-full h-full object-cover cursor-pointer"
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

        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-base truncate">{celebrity}</h3>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex justify-between items-end">
            <div className="flex-1 mr-3">
              <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2">{title}</h4>
              <div className="flex items-center gap-2 text-slate-300 text-xs">
                <Clock className="w-3 h-3" />
                <span>{formatDate(createdAt)}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleLike}
                className={`p-3 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
                  liked ? 'bg-red-500/20 border-2 border-red-500' : 'bg-white/10 border-2 border-white/20'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'text-red-500 fill-current' : 'text-white'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
          <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-200" style={{ width: `${progress}%` }} />
        </div>

        <div className="absolute inset-0 rounded-2xl shadow-[0_0_50px_rgba(147,51,234,0.3)] pointer-events-none" />
      </div>
    </div>
  );
};

export default ReelCard;
