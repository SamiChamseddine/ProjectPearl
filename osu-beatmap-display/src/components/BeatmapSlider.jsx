import { useState, useEffect } from "react";
import BeatmapCard from "./BeatmapCard";
import AudioPlayer from "./AudioPlayer";
import BeatmapSearchForm from "./BeatmapSearchForm";

const BeatmapSlider = () => {
  const API_LINK = import.meta.env.VITE_API_LINK;
  const BOT_LINK = import.meta.env.VITE_BOT_LINK;
  const [groupedBeatmapsets, setGroupedBeatmapsets] = useState([]);
  const [viewMode, setViewMode] = useState("slider");
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentBeatmapIndex, setCurrentBeatmapIndex] = useState(0);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(true);
  const [searchError, setSearchError] = useState(null);
  const [selectedDiffIndices, setSelectedDiffIndices] = useState({});
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const [filters, setFilters] = useState({
    bpmMin: "",
    bpmMax: "",
    csMin: "",
    csMax: "",
    arMin: "",
    arMax: "",
    starsMin: "",
    starsMax: "",
    lengthMin: "",
    lengthMax: "",
    favouriteMin: "",
    favouriteMax: "",
    playCountMin: "",
    playCountMax: "",
    status: "ranked",
    created_after: "",
    created_before: "",
    creator: "",
    artist: "",
    title: "",
    accuracy: "",
  });

  const downloadAllBeatmaps = async () => {
    alert(
      "Your browser might block multiple pop-up downloads, please remember to enable multiple pop-ups for this website."
    );
    setIsDownloadingAll(true);
    let downloadedCount = 0;

    try {
      for (const set of groupedBeatmapsets) {
        const downloadUrl = `${BOT_LINK}${set.beatmapsetId}`;

        // Try window.open() first (best for downloads)
        window.open(downloadUrl, "_blank");
        downloadedCount++;
        console.log(
          `Downloading ${downloadedCount}/${groupedBeatmapsets.length}`
        );

        // Wait 3 seconds before next download (adjust if needed)
        if (downloadedCount < groupedBeatmapsets.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      console.error("Download error:", error);
      alert(
        `Partially completed: ${downloadedCount}/${groupedBeatmapsets.length}`
      );
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const fetchBeatmaps = async (params = {}, append = false) => {
    if (isLoading) return;

    setIsLoading(true);
    setSearchError(null);

    try {
      // Build query params
      const queryParams = {
        limit: "20",
        ...Object.fromEntries(
          Object.entries(params).filter(([_, value]) => value !== "")
        ),
      };

      // Only add cursor if we're appending to existing results
      if (append && cursor) {
        queryParams.cursor = cursor;
      }

      const response = await fetch(
        `${API_LINK}/api/beatmaps/search?${new URLSearchParams(queryParams)}`
      );

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const { results, cursor: next_cursor } = await response.json();
      console.log("API Response:", results); // Debug log

      const newGroups = groupByBeatmapset(results);
      console.log("Grouped Data:", newGroups); // Debug log

      setGroupedBeatmapsets((prev) =>
        append ? [...prev, ...newGroups] : newGroups
      );
      setCursor(next_cursor);
      setHasMoreResults(!!next_cursor);

      if (!append) {
        setCurrentSetIndex(0);
        setCurrentBeatmapIndex(0);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setSearchError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const groupByBeatmapset = (beatmaps) => {
    const groupsMap = new Map();

    beatmaps.forEach((beatmap) => {
      if (!groupsMap.has(beatmap.beatmapset_id)) {
        groupsMap.set(beatmap.beatmapset_id, {
          // BeatmapSet metadata
          beatmapsetId: beatmap.beatmapset_id,
          title: beatmap.title, // From backend's beatmapset.title
          artist: beatmap.artist, // From backend's beatmapset.artist
          creator: beatmap.creator, // From backend's beatmapset.creator
          favourite_count: beatmap.favourite_count, // From beatmapset
          play_count: beatmap.play_count, // From beatmapset
          ranked_date: beatmap.ranked_date, // From beatmapset
          status: beatmap.status, // From beatmapset
          tags: beatmap.tags, // From beatmapset
          beatmaps: [],
        });
      }

      groupsMap.get(beatmap.beatmapset_id).beatmaps.push({
        // Individual beatmap data
        id: beatmap.id,
        version: beatmap.version,
        stars: beatmap.difficulty_rating, // Make sure this matches what you call it
        difficulty_rating: beatmap.difficulty_rating, // Alternative if you use both
        ar: beatmap.ar,
        cs: beatmap.cs,
        accuracy: beatmap.accuracy,
        bpm: beatmap.bpm,
        length: beatmap.total_length, // Make sure this matches
        total_length: beatmap.total_length, // Alternative
        mode: beatmap.mode,
        beatmapset_id: beatmap.beatmapset_id, // Critical for audio/image
        max_combo: beatmap.max_combo,
      });
    });

    return Array.from(groupsMap.values());
  };

  const handleLoadMore = () => {
    if (hasMoreResults && !isLoading) {
      fetchBeatmaps(filters, true);
    }
  };

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    fetchBeatmaps(newFilters, false);
  };

  // Current beatmap data
  const currentSet = groupedBeatmapsets[currentSetIndex];
  const currentBeatmap = currentSet?.beatmaps[currentBeatmapIndex];

  // Initial load
  useEffect(() => {
    fetchBeatmaps(filters);
  }, []);

  return (
    <div className="bg-black min-h-screen text-white font-orbitron overflow-x-hidden">
      {/* Neon Grain and Scanlines */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-30 mix-blend-soft-light" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_50%,transparent_50%)] bg-[size:100%_2px] opacity-20 mix-blend-overlay" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-6">
        {/* Beatmap Search Form */}
        <BeatmapSearchForm initialFilters={filters} onSearch={handleSearch} />

        {/* View Mode Toggle */}
        <div className="flex justify-center my-6">
          <div className="inline-flex rounded-full shadow-lg border border-pink-400/40 backdrop-blur-md bg-black/30 overflow-hidden">
            {["slider", "grid"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-5 py-2 text-sm font-bold tracking-wide uppercase transition-all ${
                  viewMode === mode
                    ? "bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-[0_0_14px_rgba(255,0,255,0.6)]"
                    : "text-pink-300 hover:bg-black/40"
                }`}
              >
                {mode === "slider" ? "Slider View" : "Grid View"}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner (initial load) */}
        {isLoading && !groupedBeatmapsets.length ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-12 w-12 rounded-full border-4 border-pink-500 border-t-transparent animate-spin" />
          </div>
        ) : groupedBeatmapsets.length > 0 ? (
          <>
            {viewMode === "slider" ? (
              <>
                {/* Slider Controls */}
                <div className="flex justify-between items-center mt-10 mb-6">
                  <button
                    onClick={() =>
                      setCurrentSetIndex((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={currentSetIndex === 0}
                    className="px-4 py-2 rounded-md bg-pink-600 hover:bg-pink-700 disabled:opacity-50 transition shadow-lg"
                  >
                    ← Prev Set
                  </button>
                  <h2 className="text-xl font-bold tracking-wider text-pink-300">
                    Set {currentSetIndex + 1} of {groupedBeatmapsets.length}
                  </h2>
                  <button
                    onClick={() =>
                      setCurrentSetIndex((prev) =>
                        Math.min(prev + 1, groupedBeatmapsets.length - 1)
                      )
                    }
                    disabled={currentSetIndex === groupedBeatmapsets.length - 1}
                    className="px-4 py-2 rounded-md bg-pink-600 hover:bg-pink-700 disabled:opacity-50 transition shadow-lg"
                  >
                    Next Set →
                  </button>
                </div>

                {/* Beatmap Slider + Dots */}
                <div className="flex flex-col items-center gap-6">
                  {/* Pagination Dots */}
                  <div className="flex justify-center gap-2">
                    {currentSet?.beatmaps.map((b, i) => (
                      <button
                        key={b.id}
                        onClick={() => setCurrentBeatmapIndex(i)}
                        className={`w-3 h-3 rounded-full ${
                          i === currentBeatmapIndex
                            ? "bg-pink-500 shadow-[0_0_8px_rgba(255,0,255,0.6)]"
                            : "bg-gray-600 hover:bg-pink-400"
                        }`}
                        aria-label={`Go to difficulty ${i + 1}`}
                      />
                    ))}
                  </div>

                  {currentBeatmap && (
                    <div className="w-full max-w-5xl">
                      <BeatmapCard
                        beatmap={currentBeatmap}
                        beatmapset={currentSet}
                        isPlaying={currentAudio === currentBeatmap.id}
                        onPlayToggle={() =>
                          setCurrentAudio((prev) =>
                            prev === currentBeatmap.id
                              ? null
                              : currentBeatmap.id
                          )
                        }
                      />
                      <div className="flex justify-center mt-4">
                        <button
                          onClick={() =>
                            window.open(
                              `${BOT_LINK}${currentBeatmap.beatmapset_id}`,
                              "_blank"
                            )
                          }
                          className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Grid View
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                {groupedBeatmapsets.map((set, setIndex) => {
                  const hardestDiff = set.beatmaps.reduce((prev, current) =>
                    prev.difficulty_rating > current.difficulty_rating
                      ? prev
                      : current
                  );
                  const selectedDiffIndex =
                    selectedDiffIndices[set.beatmapsetId] || 0;
                  const selectedBeatmap =
                    set.beatmaps[selectedDiffIndex] || hardestDiff;

                  return (
                    <div key={set.beatmapsetId} className="w-full">
                      <div className="flex justify-center gap-1 mb-2">
                        {set.beatmaps.map((beatmap, idx) => (
                          <button
                            key={beatmap.id}
                            onClick={() =>
                              setSelectedDiffIndices((prev) => ({
                                ...prev,
                                [set.beatmapsetId]: idx,
                              }))
                            }
                            className={`px-2 py-1 text-xs rounded ${
                              idx === selectedDiffIndex
                                ? "bg-pink-600 text-white"
                                : "bg-gray-700 hover:bg-gray-600"
                            }`}
                          >
                            {beatmap.version}
                          </button>
                        ))}
                      </div>
                      <BeatmapCard
                        beatmap={selectedBeatmap}
                        beatmapset={set}
                        isPlaying={currentAudio === selectedBeatmap.id}
                        onPlayToggle={() => {
                          setCurrentSetIndex(setIndex);
                          setCurrentBeatmapIndex(
                            set.beatmaps.findIndex(
                              (b) => b.id === selectedBeatmap.id
                            )
                          );
                          setCurrentAudio((prev) =>
                            prev === selectedBeatmap.id
                              ? null
                              : selectedBeatmap.id
                          );
                        }}
                        compactMode={true}
                      />
                      <div className="flex justify-center mt-2">
                        <button
                          onClick={() =>
                            window.open(
                              `${BOT_LINK}${selectedBeatmap.beatmapset_id}`,
                              "_blank"
                            )
                          }
                          className="px-4 py-1 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="flex justify-center mt-1">
              <button
                onClick={downloadAllBeatmaps}
                disabled={isDownloadingAll}
                className="bg-gradient-to-r from-pink-500 to-fuchsia-700 px-6 py-2 rounded-lg font-semibold text-white shadow-[0_0_14px_rgba(255,0,255,0.4)] hover:brightness-110 transition disabled:opacity-50"
              >
                {isDownloadingAll ? (
                  <>
                    <span className="inline-block mr-2">Downloading...</span>
                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  </>
                ) : (
                  "Download All"
                )}
              </button>
            </div>
            {/* Load More Button (appears in both views) */}
            {hasMoreResults && (
              <div className="flex justify-center mt-1">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-pink-500 to-fuchsia-700 px-6 py-2 rounded-lg font-semibold text-white shadow-[0_0_14px_rgba(255,0,255,0.4)] hover:brightness-110 transition disabled:opacity-50"
                >
                  {isLoading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}

            {/* Loading indicator for additional items */}
            {isLoading && groupedBeatmapsets.length > 0 && (
              <div className="flex justify-center py-4">
                <div className="h-8 w-8 rounded-full border-4 border-pink-500 border-t-transparent animate-spin" />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 text-pink-300 text-lg">
            {Object.values(filters).some((v) => v && v !== "ranked")
              ? "No beatmaps match your filters"
              : "Search for beatmaps using the filters above"}
          </div>
        )}

        {/* Audio Player */}
        {currentBeatmap && currentAudio === currentBeatmap.id && (
          <AudioPlayer
            key={currentBeatmap.id}
            audioUrl={`https://b.ppy.sh/preview/${currentBeatmap.beatmapset_id}.mp3`}
            onEnded={() => setCurrentAudio(null)}
          />
        )}

        {/* Error Handling */}
        {searchError && (
          <div className="text-red-400 text-center py-6 font-bold text-lg">
            Error: {searchError}
          </div>
        )}

        {/* Back to Top Button */}
        {groupedBeatmapsets.length > 10 && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 bg-pink-600 p-3 rounded-full shadow-lg z-50"
            aria-label="Back to top"
          >
            ↑
          </button>
        )}
      </div>
    </div>
  );
};

export default BeatmapSlider;
