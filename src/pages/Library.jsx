import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import Button from "../components/ui/Button";

function Library() {
  const [songs, setSongs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // API 호출
  useEffect(() => {
    api.get('/api/songs')
      .then((res) => setSongs(res.data))
      .catch((err) => console.error("Failed to load songs", err))
      .finally(() => setLoading(false));
  }, []);

  // 노래 삭제
  async function handleDelete(song) {                                     // ← song 전체 받음
    if (!window.confirm(`Delete this song: "${song.title}"?`)) return
    try {
      await api.delete(`/api/songs/${song.id}`)
      setSongs((prev) => prev.filter((s) => s.id !== song.id))
    } catch {
      alert('Failed to delete song.')
    }
  }

  // 필터링
  const filteredSongs = songs.filter((song) => {
    if (filter === "all") return true;
    if (filter === "learning") return song.study_status === "in_progress";
    if (filter === "done") return song.study_status === "completed";
    return true;
  });

  // 개수 계산
  const allCount = songs.length;
  const learningCount = songs.filter((s) => s.study_status === "in_progress").length;
  const doneCount = songs.filter((s) => s.study_status === "completed").length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Library</h1>

      {/* 필터 탭 */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1 rounded-full text-sm ${filter === "all"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700"
            }`}
        >
          All · {allCount}
        </button>
        <button
          onClick={() => setFilter("learning")}
          className={`px-4 py-1 rounded-full text-sm ${filter === "learning"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700"
            }`}
        >
          Learning · {learningCount}
        </button>
        <button
          onClick={() => setFilter("done")}
          className={`px-4 py-1 rounded-full text-sm ${filter === "done"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700"
            }`}
        >
          Done · {doneCount}
        </button>
      </div>

      {/* 컨텐츠 */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : filteredSongs.length === 0 ? (
        <p className="text-gray-500 text-center mt-12">
          No songs in this category
        </p>
      ) : (
        <table className="w-full">
          <thead className="bg-[--color-bg]">
            <tr>
              <th className="text-left px-4 py-2 text-xs">TITLE</th>
              <th className="text-left px-4 py-2 text-xs">ARTIST</th>
              <th className="text-left px-4 py-2 text-xs">STATUS</th>
              <th className="text-left px-4 py-2 text-xs">ACTION</th>
              <th className="text-left px-4 py-2 text-xs">DELETE</th>
            </tr>
          </thead>
          <tbody>
            {filteredSongs.map((song) => (
              <tr key={song.id} className="border-b border-gray-200">
                <td className="px-4 py-3 text-sm">{song.title}</td>
                <td className="px-4 py-3 text-sm">{song.artist}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded font-bold ${song.study_status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                      }`}
                  >
                    {song.study_status === "completed" ? "DONE" : "LEARNING"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={`/songs/${song.id}`}
                    className="text-sm underline"
                  >
                    {song.study_status === "completed" ? "Review" : "Resume"}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Button
                    onClick={() => handleDelete(song)}
                    className="text-xs text-gray-400 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Library;