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
import NavBar from './components/views/NavBar/NavBar'

import Auth from './hoc/auth'

const AuthLandingPage = Auth(LandingPage, null);
const AuthLoginPage = Auth(LoginPage, false);
const AuthRegisterPage = Auth(RegisterPage, false);
const AuthBoardListPage = Auth(BoardListPage, null);
const AuthBoardWritePage = Auth(BoardWritePage, true);
const AuthBoardDetailPage = Auth(BoardDetailPage, true);
const AuthBoardEditPage = Auth(BoardEditPage, true);

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
          <Route path="/" element={<AuthLandingPage />} />
          <Route path="/login" element={<AuthLoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<AuthRegisterPage />} />
          <Route path="/board" element={<AuthBoardListPage />} />
          <Route path="/board/write" element={<AuthBoardWritePage />} />
          <Route path="/board/:id" element={<AuthBoardDetailPage />} />
          <Route path="/board/edit/:id" element={<AuthBoardEditPage />} />
        </Routes>
    </Router>
  );
}

export default App;
