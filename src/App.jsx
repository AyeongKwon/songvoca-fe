import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Library from "./pages/Library";
import Profile from "./pages/Profile";
import Lyrics from "./pages/Lyrics";
import Study from "./pages/Study";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 인증 필요 없음 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 인증 필요 — Layout 적용 */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/library" element={<Library />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/lyrics/:id" element={<Lyrics />} />
          <Route path="/study/:id" element={<Study />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;