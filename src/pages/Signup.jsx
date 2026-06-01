import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 비밀번호 일치 확인
    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    // 비밀번호 최소 길이 (간단한 검증)
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      // 1. 회원가입
      await api.post('/api/auth/register', { name, email, password });

      // 2. 자동 로그인
      const { data } = await api.post('/api/auth/login', { email, password });
      login({
        token: data.token,
        user: { id: data.id, name: data.name, email: data.email }
      });

      navigate("/");
    } catch (err) {
      console.error("Signup failed", err);
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

      {/* 오른쪽: 회원가입 폼 */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16">
        <h2 className="text-3xl font-bold mb-8">Sign up</h2>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Maria"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-900"
              required
            />
          </div>

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
              placeholder="At least 6 characters"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-900"
              required
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded font-bold hover:bg-gray-800 transition"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-500 max-w-md">
          Already have an account?{" "}
          <Link to="/login" className="text-gray-900 underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;