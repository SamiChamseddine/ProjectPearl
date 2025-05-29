import { useState, useEffect, useRef } from "react";

const AudioPlayer = ({ audioUrl, onEnded }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => {
    // Load volume from localStorage or default to 0.3 (30%)
    const savedVolume = localStorage.getItem('audioVolume');
    return savedVolume ? Math.min(parseFloat(savedVolume), 0.5) : 0.3; // Cap at 50% if saved value is higher
  });
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);

  // Save volume to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('audioVolume', volume.toString());
  }, [volume]);

  // Volume control functions with limits
  const increaseVolume = () => {
    const newVolume = Math.min(volume + 0.1, 0.5); // Max 50%
    updateVolume(newVolume);
  };

  const decreaseVolume = () => {
    const newVolume = Math.max(volume - 0.1, 0);
    updateVolume(newVolume);
  };

  const updateVolume = (newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      updateVolume(prevVolume);
    } else {
      setPrevVolume(volume);
      updateVolume(0);
    }
    setIsMuted(!isMuted);
  };

  // Initialize audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      if (isPlaying) audio.play().catch(console.error);
    };

    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleEnd = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnd);
    audio.volume = volume;

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnd);
    };
  }, [audioUrl, volume, isPlaying]);

  // Play/pause toggle
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  // Handle seeking
  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const seekTime = (e.target.value / 100) * duration;
    audio.currentTime = seekTime;
    setProgress(seekTime);
  };

  // Handle volume slider change
  const handleVolumeChange = (e) => {
    const newVolume = Math.min(parseFloat(e.target.value), 0.5); // Enforce 50% max
    updateVolume(newVolume);
  };

  // Format time (MM:SS)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-t border-pink-500/30 z-50 p-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-3">
        <audio ref={audioRef} src={audioUrl} preload="auto" />

        {/* Progress bar with play/pause button */}
        <div className="flex items-center gap-3 w-full">
          <button 
            onClick={togglePlayPause}
            className="text-pink-300 hover:text-pink-100 transition-colors w-6"
          >
            {isPlaying ? (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </button>
          
          <span className="text-xs text-pink-300 w-10">
            {formatTime(progress)}
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={duration ? (progress / duration) * 100 : 0}
            onChange={handleSeek}
            className="flex-1 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-500"
          />
          <span className="text-xs text-pink-300 w-10">
            {formatTime(duration)}
          </span>
        </div>

        {/* Volume controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMute}
            className="text-pink-300 hover:text-pink-100 transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 16a5 5 0 0 0 0-10"></path>
                <path d="M19 12a9 9 0 0 1-9 9"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="12" x2="8" y2="12.01"></line>
                <line x1="2" y1="2" x2="22" y2="22"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              </svg>
            )}
          </button>

          <button
            onClick={decreaseVolume}
            className="text-pink-300 hover:text-pink-100 transition-colors"
            aria-label="Decrease volume"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          </button>

          <div className="flex items-center gap-1 w-24">
            <input
              type="range"
              min="0"
              max="0.5" // Physically limit slider to 50%
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-500"
            />
            <span className="text-xs text-pink-300 w-6 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>

          <button
            onClick={increaseVolume}
            className="text-pink-300 hover:text-pink-100 transition-colors"
            aria-label="Increase volume"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;