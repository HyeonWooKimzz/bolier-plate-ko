import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBoards } from '../../../_actions/board_action';
import './BoardPage.css';

function BoardListPage() {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);

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

  return (
    <div className="board-container">
      <h1>📋 간단 게시판</h1>
      <button onClick={handleWriteClick}>글쓰기</button>

      <div className="board-list">
        {boards.map((board) => (
          <div
            className="board-card"
            key={board._id}
            onClick={() => handleCardClick(board._id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-header">
              <h3>{board.title}</h3>
            </div>
            <p>{board.content}</p>
            <p className="writer">작성자:{board.writer}</p>
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
