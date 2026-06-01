import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post('/api/auth/login', { email, password });

      // 백엔드 응답: { token, id, email, name }
      login({
        token: data.token,
        user: { id: data.id, name: data.name, email: data.email }
      });

      navigate("/");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* 왼쪽: 브랜딩 */}
      <div className="hidden md:flex md:w-1/2 bg-[var(--color-bg)] flex-col justify-center px-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-2">
          Learn Korean
        </h1>
        <h1 className="text-5xl font-bold text-gray-900 mb-8">
          with Song.
        </h1>
        <p className="text-2xl font-bold text-gray-900">SongVoca</p>
        <p className="text-sm text-gray-500 mt-1">Learn Korean through songs</p>
      </div>

      {/* 오른쪽: 로그인 폼 */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16">
        <h2 className="text-3xl font-bold mb-8">Log in</h2>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maria@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-900"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded font-bold hover:bg-gray-800 transition"
          >
            Log in
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-500 max-w-md">
          Don't have an account?{" "}
          <Link to="/signup" className="text-gray-900 underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;