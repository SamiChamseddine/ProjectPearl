import { useState } from "react";
import { useTheme } from "../context/ThemeContext.";
export default function BeatmapSearchForm({ initialFilters, onSearch }) {
  const [filters, setFilters] = useState(
    initialFilters || {
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
      favouritesMin: "",
      favouritesMax: "",
      playCountMin: "",
      playCountMax: "",
      status: "ranked",
      created_after: "",
      created_before: "",
      creator: "",
      artist: "",
      title: "",
      tags: "",
    }
  );

  const { theme } = useTheme();

  const themeStyles = {
    neon: {
      bg: "bg-black/80",
      border: "border-pink-400/30",
      shadow: "shadow-[0_0_20px_rgba(255,0,255,0.2)]",
      text: "text-pink-300",
      gradient: "from-pink-300 to-fuchsia-300",
      highlight: "text-white",
      dropShadow: "drop-shadow-[0_0_8px_#FF00FF]",
      sectionBorder: "border-gray-800",
      buttonPrimary: "from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500",
      buttonSecondary: "from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500"
    },
    flashbang: {
      bg: "bg-white/90",
      border: "border-blue-400/50",
      shadow: "shadow-[0_0_20px_rgba(0,200,255,0.3)]",
      text: "text-blue-700",
      gradient: "from-blue-500 to-cyan-400",
      highlight: "text-black",
      dropShadow: "drop-shadow-[0_0_8px_#00BFFF]",
      sectionBorder: "border-gray-300",
      buttonPrimary: "from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500",
      buttonSecondary: "from-gray-300 to-gray-400 hover:from-gray-200 hover:to-gray-300"
    }
  };

  const currentTheme = themeStyles[theme];
  const statusOptions = [
    { value: "ranked", label: "Ranked" },
    { value: "loved", label: "Loved" },
    { value: "qualified", label: "Qualified" },
    { value: "pending", label: "Pending" },
    { value: "graveyard", label: "Graveyard" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const resetFilters = () => {
    setFilters({
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
      favouritesMin: "",
      favouritesMax: "",
      playCountMin: "",
      playCountMax: "",
      status: "ranked",
      created_after: "",
      created_before: "",
      creator: "",
      artist: "",
      title: "",
      tags: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${currentTheme.bg} p-2 rounded-xl ${currentTheme.shadow} border ${currentTheme.border} backdrop-blur-sm`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 max-w-7xl mx-auto">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Difficulty Filters */}
          <div className={`${currentTheme.bg} rounded-xl ${currentTheme.shadow} border ${currentTheme.sectionBorder} p-2`}>
            <h3 className={`text-xl font-bold bg-gradient-to-r text-green-300 text-transparent bg-clip-text mb-4 ${currentTheme.dropShadow} p-2`}>
              Difficulty Filters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
              {/* BPM */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ${currentTheme.text}`}>
                  BPM Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="bpmMin"
                    placeholder="Min"
                    min="0"
                    value={filters.bpmMin}
                    onChange={handleChange}
                    className={`w-full p-2 ${theme === 'neon' ? 'bg-gray-900/50' : 'bg-white/80'} rounded-lg ${currentTheme.text} border ${currentTheme.border} focus:ring-1 focus:ring-blue-500/50`}
                  />
                  <input
                    type="number"
                    name="bpmMax"
                    placeholder="Max"
                    min="0"
                    value={filters.bpmMax}
                    onChange={handleChange}
                    className={`w-full p-2 ${theme === 'neon' ? 'bg-gray-900/50' : 'bg-white/80'} rounded-lg ${currentTheme.text} border ${currentTheme.border} focus:ring-1 focus:ring-blue-500/50`}
                  />
                </div>
              </div>

              {/* Star Rating */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ${currentTheme.text}`}>
                  Star Rating
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="starsMin"
                    placeholder="Min"
                    min="0"
                    step="0.1"
                    value={filters.starsMin}
                    onChange={handleChange}
                    className={`w-full p-2 ${theme === 'neon' ? 'bg-gray-900/50' : 'bg-white/80'} rounded-lg ${currentTheme.text} border ${currentTheme.border} focus:ring-1 focus:ring-blue-500/50`}
                  />
                  <input
                    type="number"
                    name="starsMax"
                    placeholder="Max"
                    min="0"
                    step="0.1"
                    value={filters.starsMax}
                    onChange={handleChange}
                    className={`w-full p-2 ${theme === 'neon' ? 'bg-gray-900/50' : 'bg-white/80'} rounded-lg ${currentTheme.text} border ${currentTheme.border} focus:ring-1 focus:ring-blue-500/50`}
                  />
                </div>
              </div>

              {/* Circle Size */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ${currentTheme.text}`}>
                  Circle Size
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="csMin"
                    placeholder="Min"
                    min="0"
                    max="10"
                    step="0.1"
                    value={filters.csMin}
                    onChange={handleChange}
                    className={`w-full p-2 ${theme === 'neon' ? 'bg-gray-900/50' : 'bg-white/80'} rounded-lg ${currentTheme.text} border ${currentTheme.border} focus:ring-1 focus:ring-blue-500/50`}
                  />
                  <input
                    type="number"
                    name="csMax"
                    placeholder="Max"
                    min="0"
                    max="10"
                    step="0.1"
                    value={filters.csMax}
                    onChange={handleChange}
                    className={`w-full p-2 ${theme === 'neon' ? 'bg-gray-900/50' : 'bg-white/80'} rounded-lg ${currentTheme.text} border ${currentTheme.border} focus:ring-1 focus:ring-blue-500/50`}
                  />
                </div>
              </div>

              {/* Approach Rate */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ${currentTheme.text}`}>
                  Approach Rate
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="arMin"
                    placeholder="Min"
                    min="0"
                    max="10"
                    step="0.1"
                    value={filters.arMin}
                    onChange={handleChange}
                    className={`w-full p-2 ${theme === 'neon' ? 'bg-gray-900/50' : 'bg-white/80'} rounded-lg ${currentTheme.text} border ${currentTheme.border} focus:ring-1 focus:ring-blue-500/50`}
                  />
                  <input
                    type="number"
                    name="arMax"
                    placeholder="Max"
                    min="0"
                    max="10"
                    step="0.1"
                    value={filters.arMax}
                    onChange={handleChange}
                    className={`w-full p-2 ${theme === 'neon' ? 'bg-gray-900/50' : 'bg-white/80'} rounded-lg ${currentTheme.text} border ${currentTheme.border} focus:ring-1 focus:ring-blue-500/50`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Filters */}
          <div className={`${currentTheme.bg} rounded-xl shadow-xlp-2 border ${currentTheme.sectionBorder} p-2`}>
            <h3 className={`text-xl font-bold bg-gradient-to-r ${currentTheme.gradient} text-transparent bg-clip-text mb-4 ${currentTheme.dropShadow} p-2`}>
              Stats Filters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Length */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ${currentTheme.text}`}>
                  Length (seconds)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="lengthMin"
                    placeholder="Min"
                    min="0"
                    value={filters.lengthMin}
                    onChange={handleChange}
                    className={`w-full p-2 ${theme === 'neon' ? 'bg-gray-900/50' : 'bg-white/80'} rounded-lg ${currentTheme.text} border ${currentTheme.border} focus:ring-1 focus:ring-blue-500/50`}
                  />
                  <input
                    type="number"
                    name="lengthMax"
                    placeholder="Max"
                    min="0"
                    value={filters.lengthMax}
                    onChange={handleChange}
                    className={`w-full p-2 ${theme === 'neon' ? 'bg-gray-900/50' : 'bg-white/80'} rounded-lg ${currentTheme.text} border ${currentTheme.border} focus:ring-1 focus:ring-blue-500/50`}
                  />
                </div>
              </div>

              {/* Play Count */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ${currentTheme.text}`}>
                  Play Count
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="playCountMin"
                    placeholder="Min"
                    min="0"
                    value={filters.playCountMin}
                    onChange={handleChange}
                    className={`w-full p-2 ${theme === 'neon' ? 'bg-gray-900/50' : 'bg-white/80'} rounded-lg ${currentTheme.text} border ${currentTheme.border} focus:ring-1 focus:ring-blue-500/50`}
                  />
                  <input
                    type="number"
                    name="playCountMax"
                    placeholder="Max"
                    min="0"
                    value={filters.playCountMax}
                    onChange={handleChange}
                    className={`w-full p-2 ${theme === 'neon' ? 'bg-gray-900/50' : 'bg-white/80'} rounded-lg ${currentTheme.text} border ${currentTheme.border} focus:ring-1 focus:ring-blue-500/50`}
                  />
                </div>
              </div>

              {/* Favorites */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ${currentTheme.text}`}>
                  Favorites
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="favouritesMin"
                    placeholder="Min"
                    min="0"
                    value={filters.favouritesMin}
                    onChange={handleChange}
                    className={`w-full p-2 ${theme === 'neon' ? 'bg-gray-900/50' : 'bg-white/80'} rounded-lg ${currentTheme.text} border ${currentTheme.border} focus:ring-1 focus:ring-blue-500/50`}
                  />
                  <input
                    type="number"
                    name="favouritesMax"
                    placeholder="Max"
                    min="0"
                    value={filters.favouritesMax}
                    onChange={handleChange}
                    className={`w-full p-2 ${theme === 'neon' ? 'bg-gray-900/50' : 'bg-white/80'} rounded-lg ${currentTheme.text} border ${currentTheme.border} focus:ring-1 focus:ring-blue-500/50`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Metadata */}
          <div className={`${currentTheme.bg} rounded-xl shadow-xlp-2 border ${currentTheme.sectionBorder} p-2`}>
            <h3 className={`text-xl font-bold bg-gradient-to-r text-orange-300 text-transparent bg-clip-text mb-4 ${currentTheme.dropShadow} p-2`}>
              Metadata
            </h3>

            <div className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ${currentTheme.text}`}>
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Song title"
                  value={filters.title}
                  onChange={handleChange}
                  className={`w-full p-2 ${theme === 'neon' ? 'bg-gray-900/50' : 'bg-white/80'} rounded-lg ${currentTheme.text} border ${currentTheme.border} focus:ring-1 focus:ring-blue-500/50`}
                />
              </div>
              {/* Artist */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ${currentTheme.text}`}>
                  Artist
                </label>
                <input
                  type="text"
                  name="artist"
                  placeholder="Artist name"
                  value={filters.artist}
                  onChange={handleChange}
                  className={`w-full p-2 ${theme === 'neon' ? 'bg-gray-900/50' : 'bg-white/80'} rounded-lg ${currentTheme.text} border ${currentTheme.border} focus:ring-1 focus:ring-blue-500/50`}
                />
              </div>
              {/* Mapper */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ${currentTheme.text}`}>
                  Mapper
                </label>
                <input
                  type="text"
                  name="creator"
                  placeholder="Mapper username"
                  value={filters.creator}
                  onChange={handleChange}
                  className={`w-full p-2 ${theme === 'neon' ? 'bg-gray-900/50' : 'bg-white/80'} rounded-lg ${currentTheme.text} border ${currentTheme.border} focus:ring-1 focus:ring-blue-500/50`}
                />
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-medium ${currentTheme.text}`}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  placeholder="japanese, metal, dnb"
                  value={filters.tags}
                  onChange={handleChange}
                  className={`w-full p-2 ${theme === 'neon' ? 'bg-gray-900/50' : 'bg-white/80'} rounded-lg ${currentTheme.text} border ${currentTheme.border} focus:ring-1 focus:ring-blue-500/50`}
                />
              </div>
              {/* Status */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ${currentTheme.text}`}>
                  Status
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleChange}
                  className={`w-full p-2 ${theme === 'neon' ? 'bg-gray-900/50' : 'bg-white/80'} rounded-lg ${currentTheme.text} border ${currentTheme.border} focus:ring-1 focus:ring-blue-500/50`}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className={`${currentTheme.bg} rounded-xl shadow-xlp-2 border ${currentTheme.sectionBorder} p-2`}>
            <h3 className={`text-xl font-bold bg-gradient-to-r text-yellow-300 text-transparent bg-clip-text mb-4 ${currentTheme.dropShadow} p-2`}>
              Date Range
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Created After */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ${currentTheme.text}`}>
                  From
                </label>
                <input
                  type="date"
                  name="created_after"
                  value={filters.created_after}
                  onChange={handleChange}
                  className={`w-full p-2 ${theme === 'neon' ? 'bg-gray-900/50' : 'bg-white/80'} rounded-lg ${currentTheme.text} border ${currentTheme.border} focus:ring-1 focus:ring-blue-500/50`}
                />
              </div>

              {/* Created Before */}
              <div className="space-y-2">
                <label className={`text-sm font-medium ${currentTheme.text}`}>
                  To
                </label>
                <input
                  type="date"
                  name="created_before"
                  value={filters.created_before}
                  onChange={handleChange}
                  className={`w-full p-2 ${theme === 'neon' ? 'bg-gray-900/50' : 'bg-white/80'} rounded-lg ${currentTheme.text} border ${currentTheme.border} focus:ring-1 focus:ring-blue-500/50`}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={resetFilters}
              className={`px-6 py-3 bg-gradient-to-r ${currentTheme.buttonSecondary} ${currentTheme.highlight} rounded-lg shadow-lg transition-all hover:shadow-[0_0_15px_rgba(156,163,175,0.3)]`}
            >
              Reset
            </button>
            <button
              type="submit"
              className={`px-6 py-3 bg-gradient-to-r ${currentTheme.buttonPrimary} ${currentTheme.highlight} font-medium rounded-lg shadow-lg transition-all hover:shadow-[0_0_15px_rgba(0,200,255,0.5)]`}
            >
              Search Beatmaps
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}