import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBoards } from '../../../_actions/board_action';
import './BoardPage.css';

function BoardListPage() {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      const data = await fetchBoards();
      setBoards(data);
    } catch (error) {
      console.error('게시글 불러오기 실패:', error);
    }
  };

  const handleWriteClick = () => {
    navigate('/board/write');
  };
    const handleCardClick = (id) => {
        navigate(`/board/${id}`);
  };

  const filteredBoards = boards.filter(board =>
    board.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="board-container">
      <h1>📋 간단 게시판</h1>
      <button onClick={handleWriteClick}>글쓰기</button>

      <input
        type="text"
        placeholder="검색어를 입력하세요."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ margin: '10px 0', padding: '5px', width: '100%'}}
      />

      <div className="board-list">
        {filteredBoards.map((board) => (
          <div
            className="board-card"
            key={board._id}
            onClick={() => handleCardClick(board._id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-header">
              <h3>{board.title}</h3>
            </div>
            <span className="timestamp">
              {new Date(board.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoardListPage;
