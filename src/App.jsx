import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
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
        {/* Layout 적용 (사이드바 + 메인 영역) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/library" element={<Library />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/lyrics/:id" element={<Lyrics />} />
        </Route>
        
        {/* Layout 없는 경로 (전체 화면) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/study/:id" element={<Study />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;