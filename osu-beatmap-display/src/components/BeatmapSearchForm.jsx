import { useState } from "react";

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
      className="bg-black p-2 rounded-xl shadow-xl border border-black "
    >
      

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 max-w-7xl mx-auto">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Difficulty Filters */}
          <div className="bg-black rounded-xl shadow-xl border border-gray-800">
            <h3 className="text-xl font-bold text-blue-400 mb-4 drop-shadow-[0_0_8px_#3b82f6] p-2">
              Difficulty Filters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
              {/* BPM */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
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
                    className="w-full p-2 bg-gray-900/50 rounded-lg text-white border border-pink-500/50 focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50"
                  />
                  <input
                    type="number"
                    name="bpmMax"
                    placeholder="Max"
                    min="0"
                    value={filters.bpmMax}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-900/50 rounded-lg text-white border border-pink-500/50 focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50"
                  />
                </div>
              </div>

              {/* Star Rating */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
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
                    className="w-full p-2 bg-gray-900/50 rounded-lg text-white border border-yellow-500/50 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50"
                  />
                  <input
                    type="number"
                    name="starsMax"
                    placeholder="Max"
                    min="0"
                    step="0.1"
                    value={filters.starsMax}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-900/50 rounded-lg text-white border border-yellow-500/50 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50"
                  />
                </div>
              </div>

              {/* Circle Size */}
              <div className="space-y-2 ">
                <label className="text-sm font-medium text-gray-300">
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
                    className="w-full p-2 bg-gray-900/50 rounded-lg text-white border border-blue-500/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
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
                    className="w-full p-2 bg-gray-900/50 rounded-lg text-white border border-blue-500/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                  />
                </div>
              </div>

              {/* Approach Rate */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
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
                    className="w-full p-2 bg-gray-900/50 rounded-lg text-white border border-purple-500/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
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
                    className="w-full p-2 bg-gray-900/50 rounded-lg text-white border border-purple-500/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Filters */}
          <div className="bg-black rounded-xl shadow-xlp-2 border border-gray-800 p-2">
            <h3 className="text-xl font-bold text-green-400 mb-4 drop-shadow-[0_0_8px_#10b981]">
              Stats Filters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Length */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
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
                    className="w-full p-2 bg-gray-900/50 rounded-lg text-white border border-green-500/50 focus:border-green-500 focus:ring-1 focus:ring-green-500/50"
                  />
                  <input
                    type="number"
                    name="lengthMax"
                    placeholder="Max"
                    min="0"
                    value={filters.lengthMax}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-900/50 rounded-lg text-white border border-green-500/50 focus:border-green-500 focus:ring-1 focus:ring-green-500/50"
                  />
                </div>
              </div>

              {/* Play Count */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
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
                    className="w-full p-2 bg-gray-900/50 rounded-lg text-white border border-orange-500/50 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                  />
                  <input
                    type="number"
                    name="playCountMax"
                    placeholder="Max"
                    min="0"
                    value={filters.playCountMax}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-900/50 rounded-lg text-white border border-orange-500/50 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                  />
                </div>
              </div>

              {/* Favorites */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
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
                    className="w-full p-2 bg-gray-900/50 rounded-lg text-white border border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                  />
                  <input
                    type="number"
                    name="favouritesMax"
                    placeholder="Max"
                    min="0"
                    value={filters.favouritesMax}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-900/50 rounded-lg text-white border border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Metadata */}
          <div className="bg-black rounded-xl shadow-xlp-2 border border-gray-800 p-2">
            <h3 className="text-xl font-bold text-cyan-400 mb-4 drop-shadow-[0_0_8px_#06b6d4]">
              Metadata
            </h3>

            <div className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Song title"
                  value={filters.title}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-900/50 rounded-lg text-white border border-cyan-500/50 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
                />
              </div>
              {/* Artist */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Artist
                </label>
                <input
                  type="text"
                  name="artist"
                  placeholder="Artist name"
                  value={filters.artist}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-900/50 rounded-lg text-white border border-cyan-500/50 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
                />
              </div>
              {/* Mapper */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Mapper
                </label>
                <input
                  type="text"
                  name="creator"
                  placeholder="Mapper username"
                  value={filters.creator}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-900/50 rounded-lg text-white border border-cyan-500/50 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  placeholder="japanese, metal, dnb"
                  value={filters.tags}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-900/50 rounded-lg text-white border border-cyan-500/50 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
                />
              </div>
              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Status
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-900/50 rounded-lg text-white border border-cyan-500/50 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
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
          <div className="bg-black rounded-xl shadow-xlp-2 border border-gray-800 p-2">
            <h3 className="text-xl font-bold text-purple-400 mb-4 drop-shadow-[0_0_8px_#a855f7]">
              Date Range
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Created After */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  From
                </label>
                <input
                  type="date"
                  name="created_after"
                  value={filters.created_after}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-900/50 rounded-lg text-white border border-purple-500/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
                />
              </div>

              {/* Created Before */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">To</label>
                <input
                  type="date"
                  name="created_before"
                  value={filters.created_before}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-900/50 rounded-lg text-white border border-purple-500/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={resetFilters}
              className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white rounded-lg shadow-lg transition-all hover:shadow-[0_0_15px_rgba(156,163,175,0.3)]"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium rounded-lg shadow-lg transition-all hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]"
            >
              Search Beatmaps
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
