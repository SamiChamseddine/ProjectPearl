import { motion, useAnimation } from "framer-motion";
import { PlayCircleIcon, PauseCircleIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";

export default function BeatmapCard({
  beatmap,
  beatmapset,
  isPlaying,
  onPlayToggle,
}) {
  const [imageError, setImageError] = useState(false);
  const controls = useAnimation();
  const imageUrl = `https://assets.ppy.sh/beatmaps/${beatmap.beatmapset_id}/covers/cover@2x.jpg`;

  useEffect(() => {
    controls.start({ scale: isPlaying ? 1.05 : 1 });
  }, [isPlaying, controls]);

  return (
    <motion.div
      className="relative w-full max-w-3xl h-[460px] rounded-2xl overflow-hidden border border-pink-500/50 mx-auto bg-black font-orbitron shadow-[0_0_80px_rgba(255,0,255,0.3)]"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Background Image */}
      {!imageError ? (
        <motion.div
          className="absolute inset-0 bg-cover bg-center saturate-[1.8] contrast-[1.4] brightness-[1.15]"
          style={{ backgroundImage: `url(${imageUrl})` }}
          animate={controls}
          transition={{ duration: 0.6 }}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-gray-400 text-lg font-medium">
          No cover available
        </div>
      )}

      {/* Gritty Noise + Scanlines */}
      <div className="absolute inset-0 z-10 pointer-events-none mix-blend-soft-light opacity-[0.35] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
      <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.04)_50%,transparent_50%)] bg-[size:100%_2px] mix-blend-overlay opacity-40" />

      {/* Neon Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/70 to-black z-10" />

      {/* Outer Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-fuchsia-700/20 blur-2xl opacity-60 animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-end p-6 text-white space-y-5">
        <div>
          <motion.h3
            className="text-4xl font-extrabold bg-gradient-to-r from-pink-400 via-fuchsia-500 to-purple-500 text-transparent bg-clip-text drop-shadow-[0_0_14px_#FF00F7]"
            whileHover={{ x: 6 }}
          >
            {beatmapset.title}
          </motion.h3>
          <p className="text-lg text-fuchsia-200 font-semibold drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]">
            {beatmapset.artist}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
          ].map(({ label, value }, i) => (
            <div
              key={i}
              className="bg-black/40 border border-pink-500/30 rounded-lg px-4 py-2 text-center backdrop-blur-sm shadow-[0_0_20px_rgba(255,0,255,0.25)]"
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
            <div className="bg-pink-700/30 px-3 py-1 rounded-full text-xs border border-pink-400/40 shadow-inner backdrop-blur-md text-white">
              🗓️{" "}
              {new Date(beatmapset.ranked_date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          )}
          {beatmapset.status && (
            <div className="bg-purple-800/30 px-3 py-1 rounded-full text-xs border border-purple-400/40 shadow-inner backdrop-blur-md text-white">
              🏷️ {beatmapset.status}
            </div>
          )}
          {beatmapset.creator && (
            <div className="bg-fuchsia-800/30 px-3 py-1 rounded-full text-xs border border-fuchsia-400/40 shadow-inner backdrop-blur-md text-white">
              ✏️ {beatmapset.creator}
            </div>
          )}
        </div>

        {/* Play Button */}
        <motion.button
          onClick={onPlayToggle}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600 hover:brightness-110 py-3 px-6 rounded-xl shadow-[0_0_30px_rgba(236,72,153,0.7)] transition-all"
          whileTap={{ scale: 0.96 }}
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
      {isPlaying && (
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
