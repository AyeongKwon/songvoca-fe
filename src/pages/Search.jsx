import { useState } from "react";
import { Link } from "react-router-dom";

// TODO: 백엔드 API 준비되면 axios로 교체
// const { data } = await api.get('/api/lrclib/search', { params: { q: query } });
const mockResults = [
  { id: 1, title: "사랑은 늘 도망가", artist: "임영웅", album: "IM HERO", year: 2022, length: "4:00" },
  { id: 2, title: "사랑이라는 이유로", artist: "하동균", album: "Single", year: 2008, length: "4:23" },
  { id: 3, title: "사랑했지만", artist: "김광석", album: "다시 부르기", year: 1995, length: "3:45" },
  { id: 4, title: "사랑을 했다", artist: "iKON", album: "Return", year: 2018, length: "3:25" },
];

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: 백엔드 API 호출로 교체
    // const { data } = await api.get('/api/lrclib/search', { params: { q: query } });
    // setResults(data);
    
    // 임시: mockResults에서 query 포함된 것 필터
    const filtered = mockResults.filter(
      (song) =>
        song.title.includes(query) || song.artist.includes(query)
    );
    setResults(filtered);
  };

  const handleAdd = (song) => {
    // TODO: 백엔드 API 호출로 교체
    // await api.post('/api/songs', { title, artist, lyrics });
    console.log("Add song:", song);
    alert(`"${song.title}" added to library!`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Search songs</h1>

      {/* 검색창 */}
      <form onSubmit={handleSearch} className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or artist..."
          className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-900"
        />
      </form>

      {/* 결과 */}
      {results.length === 0 ? (
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
              <th className="text-left px-4 py-2 text-xs">YEAR</th>
              <th className="text-left px-4 py-2 text-xs">LENGTH</th>
              <th className="text-left px-4 py-2 text-xs">ADD</th>
            </tr>
          </thead>
          <tbody>
            {results.map((song) => (
              <tr key={song.id} className="border-b border-gray-200">
                <td className="px-4 py-3 text-sm">{song.title}</td>
                <td className="px-4 py-3 text-sm">{song.artist}</td>
                <td className="px-4 py-3 text-sm">{song.album}</td>
                <td className="px-4 py-3 text-sm">{song.year}</td>
                <td className="px-4 py-3 text-sm">{song.length}</td>
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