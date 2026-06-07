import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

function Home() {
  const { user } = useAuth();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  //API 호출
  useEffect(() => {
    api.get('/api/songs/public')
      .then((res) => setSongs(res.data))
      .catch((err) => console.error("Failed to load songs", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Hi, {user?.name || "there"} 👋
      </h1>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">🔎Hot Songs🔥</h2>
        <Link to="/search" className="text-sm underline">
          + Add song
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : songs.length === 0 ? (
        <p className="text-gray-500">No songs yet. Search and add your first song!</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {songs.map((song) => (
            <Link
              key={song.id}
              to={`/songs/${song.id}`}
              className="border border-gray-200 rounded p-4 hover:shadow"
            >
              <h3 className="font-bold">{song.title}</h3>
              <p className="text-sm text-gray-600">{song.artist}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
