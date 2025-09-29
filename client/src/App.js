import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import axios from 'axios';

import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import BoardListPage from './components/views/BoardPage/BoardListPage';
import BoardWritePage from './components/views/BoardPage/BoardWritePage';
import BoardDetailPage from './components/views/BoardPage/BoardDetailPage';
import BoardEditPage from './components/views/BoardPage/BoardEditPage';
import NavBar from './components/views/NavBar/NavBar';
import Footer from'./components/views/Footer/Footer';
import VideoListPage from './components/views/Video/VideoListPage';
import VideoPlayerPage from './components/views/Video/VideoPlayerPage';

import Auth from './hoc/auth'

const AuthLandingPage = Auth(LandingPage, null);
const AuthLoginPage = Auth(LoginPage, false);
const AuthRegisterPage = Auth(RegisterPage, false);
const AuthBoardListPage = Auth(BoardListPage, null);
const AuthBoardWritePage = Auth(BoardWritePage, true);
const AuthBoardDetailPage = Auth(BoardDetailPage, true);
const AuthBoardEditPage = Auth(BoardEditPage, true);
const AuthVideoListPage = Auth(VideoListPage, null);
const AuthVideoPlayerPage = Auth(VideoPlayerPage, true, null, [1, 2]);

function App() {
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    axios.get('/api/users/auth')
      .then(response => {
        setIsAuth(response.data.isAuth);
      })
      .catch(() => setIsAuth(false));
  }, []);

  const handleLogout = () => {
    axios.get('/api/users/logout')
      .then(() => {
        setIsAuth(false);
      })
      .catch((err) => {
        console.error('로그아웃 실패:', err);
      });
  };

  const handleLogin = () => {
    setIsAuth(true);
  };

  return (
    <Router>
        <NavBar isAuth={isAuth} onLogout={handleLogout} />
        <Routes>
          {/* 기본 페이지 */}
          <Route path="/" element={<AuthLandingPage />} />
          <Route path="/login" element={<AuthLoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<AuthRegisterPage />} />
          {/* 게시판 */}
          <Route path="/board" element={<AuthBoardListPage />} />
          <Route path="/board/write" element={<AuthBoardWritePage />} />
          <Route path="/board/:id" element={<AuthBoardDetailPage />} />
          <Route path="/board/edit/:id" element={<AuthBoardEditPage />} />
          {/* 영상 게시판 */}
          <Route path="/videos" element={<AuthVideoListPage />} />
          <Route path="/videos/:filename" element={<AuthVideoPlayerPage />} />
        </Routes>
        <Footer />
    </Router>
  );
}

export default App;
