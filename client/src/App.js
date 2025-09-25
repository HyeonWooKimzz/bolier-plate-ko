import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import Auth from './hoc/auth'

const AuthLandingPage = Auth(LandingPage, null);
const AuthLoginPage = Auth(LoginPage, false);
const AuthRegisterPage = Auth(RegisterPage, false)

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<AuthLandingPage />} />
          <Route path="/login" element={<AuthLoginPage />} />
          <Route path="/register" element={<AuthRegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
