import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";

function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const { data } = await api.get('/api/songs/search', {
        params: { q: query }
      });
      setResults(data);
    } catch (err) {
      console.error("Search failed", err);
      alert("Search failed😓.\nPlease try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (song) => {
    navigate('/songs/preview', {
      state: {
        title: song.trackName,
        artist: song.artistName,
        lyrics: song.plainLyrics,
      }
    })
  }

  // 초를 분:초로 변환, 노래 duration 표시
  const formatDuration = (sec) => {
    const min = Math.floor(sec / 60);
    let s = Math.floor(sec % 60);
    s = String(s).padStart(2, "0");
    return `${min}:${s}`;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Search songs</h1>

      <form onSubmit={handleSearch} className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or artist..."
          className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-900"
        />
      </form>

      {loading ? (
        <p className="text-xl text-gray-700 text-center mt-12">
          🔎 Searching
          <span className="inline-flex gap-0.5 ml-1">
            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
          </span>
        </p>
      ) : !hasSearched ? (
        <p className="text-gray-500 text-center mt-12">
          Type a song title or artist name above
        </p>
      ) : results.length === 0 ? (
        <p className="text-xl text-gray-500 text-center mt-12">
          No songs found.
          <br />
          Try a different keyword.🧐
        </p>
      ) : (
        <table className="w-full">
          <thead className="bg-[--color-bg]">
            <tr>
              <th className="text-left px-4 py-2 text-xs">TITLE</th>
              <th className="text-left px-4 py-2 text-xs">ARTIST</th>
              <th className="text-left px-4 py-2 text-xs">ALBUM</th>
              <th className="text-left px-4 py-2 text-xs">DURATION</th>
              <th className="text-left px-4 py-2 text-xs hidden sm:table-cell"></th>
            </tr>
          </thead>
          <tbody>
            {results.map((song) => (
              <tr key={song.id} className="border-b border-gray-200">
                <td className="px-4 py-3 text-sm">
                  {/* 모바일: title 클릭하면 handleView */}
                  <span
                    className="sm:hidden cursor-pointer font-bold hover:underline"
                    onClick={() => handleView(song)}
                  >
                    {song.trackName || "Unknown title"}
                  </span>
                  {/* 데스크탑: 그냥 텍스트 */}
                  <span className="hidden sm:inline">
                    {song.trackName || "Unknown title"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{song.artistName || "Unknown artist"}</td>
                <td className="px-4 py-3 text-sm">{song.albumName || "—"}</td>
                <td className="px-4 py-3 text-sm">{song.duration ? formatDuration(song.duration) : "—"}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <button
                    onClick={() => handleView(song)}
                    className="bg-gray-900 text-white px-3 py-1 rounded text-xs font-bold hover:bg-gray-800"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Search;
