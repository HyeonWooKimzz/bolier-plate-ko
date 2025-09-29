import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';

function NavBar({ isAuth, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      onLogout(); // 로그아웃 로직 실행
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">🏠 홈</Link>
      </div>
      <ul className="navbar-menu">
        <li>
          <Link to="/board">📋 게시판</Link>
        </li>
        <li>
          <Link to="/videos">🎬 영상 게시판</Link>
        </li>
        {/* 로그인 상태 */}
        {isAuth && (
          <li>
            <button className="navbar-button" onClick={handleLogout}>
              🚪 로그아웃
            </button>
          </li>
        )}
        {/* 비로그인 상태 */}
        {!isAuth && (
          <>
            <li>
              <Link to="/login">🔐 로그인</Link>
            </li>
            <li>
              <Link to="/register">📝 회원가입</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
