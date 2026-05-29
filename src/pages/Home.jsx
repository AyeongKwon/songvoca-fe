import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// TODO: 백엔드 API 준비되면 axios 호출로 교체
// const { data: songs } = await api.get('/api/songs')
const mockSongs = [
  { id: 1, title: "소문의 낙원", artist: "AKMU", status: "learning" },
  { id: 2, title: "Spring Day", artist: "BTS", status: "learning" },
  { id: 3, title: "벚꽃 엔딩", artist: "버스커버스커", status: "done" },
  { id: 4, title: "좋은 날", artist: "아이유", status: "learning" },
];

function Home() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Hi, {user?.name || "there"} 👋
      </h1>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Your Library</h2>
        <Link to="/search" className="text-sm underline">
          + Add song
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {mockSongs.map((song) => (
          <Link
            key={song.id}
            to={`/lyrics/${song.id}`}
            className="border border-gray-200 rounded p-4 hover:shadow"
          >
            <h3 className="font-bold">{song.title}</h3>
            <p className="text-sm text-gray-600">{song.artist}</p>
            <span className="text-xs mt-2 inline-block">
              {song.status === "done" ? "✓ DONE" : "📖 LEARNING"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;