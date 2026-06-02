import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const { data } = await api.get('/api/lrclib/search', {
        params: { q: query }
      });
      setResults(data);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (song) => {
    try {
      const { data } = await api.post('/api/songs', {
        title: song.trackName,
        artist: song.artistName,
        lyrics: song.plainLyrics,
      });
      alert(`"${data.title}" added!`);
      navigate(`/songs/${data.id}`);
    } catch (err) {
      console.error("Failed to add song", err);
    }
  };

  // 초를 분:초로 변환
  const formatDuration = (sec) => {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min}:${String(s).padStart(2, "0")}`;
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
        <p className="text-gray-500 text-center mt-12">Searching...</p>
      ) : results.length === 0 ? (
        <p className="text-gray-500 text-center mt-12">
          Type a song title or artist name above
        </p>
      ) : (
        <table className="w-full">
          <thead className="bg-[--color-bg]">
            <tr>
              <th className="text-left px-4 py-2 text-xs">TITLE</th>
              <th className="text-left px-4 py-2 text-xs">ARTIST</th>
              <th className="text-left px-4 py-2 text-xs">ALBUM</th>
              <th className="text-left px-4 py-2 text-xs">LENGTH</th>
              <th className="text-left px-4 py-2 text-xs">ADD</th>
            </tr>
          </thead>
          <tbody>
            {results.map((song) => (
              <tr key={song.id} className="border-b border-gray-200">
                <td className="px-4 py-3 text-sm">{song.trackName}</td>
                <td className="px-4 py-3 text-sm">{song.artistName}</td>
                <td className="px-4 py-3 text-sm">{song.albumName}</td>
                <td className="px-4 py-3 text-sm">{formatDuration(song.duration)}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleAdd(song)}
                    className="bg-gray-900 text-white px-3 py-1 rounded text-xs font-bold hover:bg-gray-800"
                  >
                    + Add
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