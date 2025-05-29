import { motion, useAnimation } from "framer-motion";
import { PlayCircleIcon, PauseCircleIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { usePerformance } from "../context/PerformanceContext";

export default function BeatmapCard({
  beatmap,
  beatmapset,
  isPlaying,
  onPlayToggle,
}) {
  const { performanceMode } = usePerformance();
  const [imageError, setImageError] = useState(false);
  const controls = useAnimation();
  const imageUrl = `https://assets.ppy.sh/beatmaps/${beatmap.beatmapset_id}/covers/cover@2x.jpg`;

  useEffect(() => {
    controls.start({ scale: isPlaying ? 1.05 : 1 });
  }, [isPlaying, controls]);

  const effects = {
  high: {
    // Premium visual experience (smooth but not excessive)
    scale: isPlaying ? 1.03 : 1,  // More subtle zoom
    hoverScale: 1.01,
    shadow: "0_0_30px_rgba(255,0,255,0.2)",  // More restrained glow
    backdropBlur: "xs",  // Very subtle blur
    saturate: 1.7,      // Slightly boosted colors
    contrast: 1.2,      // Mild contrast boost
    brightness: 1.1,   // Slight brightness
    noiseOpacity: 0.15,  // Barely noticeable grain
    scanlineOpacity: 0.5, // Very subtle scanlines
    glow: true,         // Keep glow but more subtle
    animations: true,
    animationSpeed: 0.2, // Snappy animations
    filterIntensity: 1   // Full filter quality
  },
  medium: {
    // Balanced performance/quality
    scale: isPlaying ? 1.02 : 1,
    hoverScale: 1.005,
    shadow: "0_0_15px_rgba(255,0,255,0.15)",
    backdropBlur: "none",
    saturate: 1.15,
    contrast: 1.1,
    brightness: 1.03,
    noiseOpacity: 0.05,  // Minimal texture
    scanlineOpacity: 0.05,
    glow: true,         // Smaller glow
    animations: true,
    animationSpeed: 0.15, // Faster animations
    filterIntensity: 0.8 // Slightly reduced filter quality
  },
  low: {
    // Maximum performance
    scale: 1,
    hoverScale: 1,
    shadow: "0_0_5px_rgba(255,0,255,0.1)",
    backdropBlur: "none",
    saturate: 1,
    contrast: 1,
    brightness: 1,
    noiseOpacity: 0,
    scanlineOpacity: 0,
    glow: false,
    animations: false,
    animationSpeed: 0,
    filterIntensity: 0.5 // Basic filters only
  }
};
  const currentEffects = effects[performanceMode];

  return (
    <motion.div
      className={`relative w-full max-w-3xl h-[460px] rounded-2xl overflow-hidden border border-pink-500/50 mx-auto bg-black font-orbitron ${
        currentEffects.shadow ? `shadow-[${currentEffects.shadow}]` : ""
      }`}
      initial={currentEffects.animations ? { scale: 0.95 } : {}}
      animate={currentEffects.animations ? { scale: currentEffects.scale } : {}}
      whileHover={
        currentEffects.animations ? { scale: currentEffects.hoverScale } : {}
      }
      transition={{ duration: currentEffects.animations ? 0.6 : 0 }}
    >
      {/* Background Image */}
      {!imageError ? (
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${imageUrl})`,
            filter: `
            saturate(${currentEffects.saturate}) 
            contrast(${currentEffects.contrast}) 
            brightness(${currentEffects.brightness})
          `,
          }}
          animate={currentEffects.animations ? controls : {}}
          transition={{ duration: currentEffects.animations ? 0.6 : 0 }}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-gray-400 text-lg font-medium">
          No cover available
        </div>
      )}

      {/* Gritty Noise + Scanlines */}
      {performanceMode !== "low" && (
        <>
          <div
            className="absolute inset-0 z-10 pointer-events-none mix-blend-soft-light"
            style={{
              opacity: currentEffects.noiseOpacity,
              backgroundImage:
                "url('https://www.transparenttextures.com/patterns/asfalt-dark.png')",
            }}
          />
          <div
            className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.04)_50%,transparent_50%)] bg-[size:100%_2px] mix-blend-overlay"
            style={{ opacity: currentEffects.scanlineOpacity }}
          />
        </>
      )}

      {/* Neon Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-black/70 to-black z-10"
        style={{ opacity: performanceMode === "low" ? 0.5 : 1 }}
      />

      {/* Outer Glow */}
      {currentEffects.glow && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-fuchsia-700/20 blur-2xl opacity-60 animate-pulse" />
        </div>
      )}

      {/* Content */}
      <div
        className={`relative z-20 h-full flex flex-col justify-end p-6 text-white space-y-5 ${
          currentEffects.backdropBlur
            ? `backdrop-blur-${currentEffects.backdropBlur}`
            : ""
        }`}
      >
        <div>
          <motion.h3
            className="text-4xl font-extrabold bg-gradient-to-r from-pink-400 via-fuchsia-500 to-purple-500 text-transparent bg-clip-text drop-shadow-[0_0_14px_#FF00F7]"
            whileHover={currentEffects.animations ? { x: 6 } : {}}
            transition={{ duration: currentEffects.animations ? 0.3 : 0 }}
          >
            {beatmapset.title}
          </motion.h3>
          <p className="text-lg text-fuchsia-200 font-semibold drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]">
            {beatmapset.artist}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 md:grid-cols-4 gap-3">
          {[
            { label: "BPM", value: beatmap.bpm },
            { label: "CS", value: beatmap.cs },
            { label: "STARS", value: beatmap.stars?.toFixed(2) || "0.00" },
            {
              label: "LENGTH",
              value: `${Math.floor(beatmap.length / 60)}:${(beatmap.length % 60)
                .toString()
                .padStart(2, "0")}`,
            },
            { label: "favourite", value: beatmapset.favourite_count ?? 0 },
            { label: "PLAYS", value: beatmapset.play_count || 0 },
            { label: "OD", value: beatmap.accuracy || 0 },
            { label: "MAX COMBO", value: beatmap.max_combo || 0 },
          ].map(({ label, value }, i) => (
            <div
              key={i}
              className={`bg-black/40 border border-pink-500/30 rounded-lg px-4 py-2 text-center ${
                currentEffects.backdropBlur ? "backdrop-blur-sm" : ""
              } shadow-[0_0_20px_rgba(255,0,255,0.25)]`}
            >
              <div className="text-xs text-pink-300 tracking-wider">
                {label}
              </div>
              <div className="text-lg font-bold text-white">{value}</div>
            </div>
          ))}
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-2">
          {beatmapset.ranked_date && (
            <div
              className={`bg-pink-700/30 px-3 py-1 rounded-full text-xs border border-pink-400/40 ${
                currentEffects.backdropBlur ? "backdrop-blur-md" : ""
              } shadow-inner text-white`}
            >
              🗓️{" "}
              {new Date(beatmapset.ranked_date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          )}
          {beatmapset.status && (
            <div
              className={`bg-purple-800/30 px-3 py-1 rounded-full text-xs border border-purple-400/40 ${
                currentEffects.backdropBlur ? "backdrop-blur-md" : ""
              } shadow-inner text-white`}
            >
              🏷️ {beatmapset.status}
            </div>
          )}
          {beatmapset.creator && (
            <div
              className={`bg-fuchsia-800/30 px-3 py-1 rounded-full text-xs border border-fuchsia-400/40 ${
                currentEffects.backdropBlur ? "backdrop-blur-md" : ""
              } shadow-inner text-white`}
            >
              ✏️ {beatmapset.creator}
            </div>
          )}
        </div>

        {/* Play Button */}
        <motion.button
          onClick={onPlayToggle}
          className={`flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600 hover:brightness-110 py-3 px-6 rounded-xl ${
            currentEffects.shadow
              ? "shadow-[0_0_30px_rgba(236,72,153,0.7)]"
              : ""
          } transition-all`}
          whileTap={currentEffects.animations ? { scale: 0.96 } : {}}
        >
          {isPlaying ? (
            <>
              <PauseCircleIcon className="h-6 w-6" />
              <span className="text-lg font-bold">PAUSE PREVIEW</span>
            </>
          ) : (
            <>
              <PlayCircleIcon className="h-6 w-6" />
              <span className="text-lg font-bold">PLAY PREVIEW</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Glowing Play Ping */}
      {isPlaying && currentEffects.animations && (
        <div className="absolute top-4 right-4 z-20">
          <div className="relative h-5 w-5">
            <div className="absolute inset-0 bg-pink-500 rounded-full animate-ping opacity-75" />
            <div className="absolute inset-0 bg-pink-600 rounded-full shadow-[0_0_14px_rgba(236,72,153,0.9)]" />
          </div>
        </div>
      )}
    </motion.div>
  );
}
