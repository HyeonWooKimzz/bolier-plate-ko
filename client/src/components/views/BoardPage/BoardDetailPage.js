import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBoardById, deleteBoard } from '../../../_actions/board_action';
import './BoardPage.css';

function BoardDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);

  useEffect(() => {
    loadBoard();
  }, [id]);

  const loadBoard = async () => {
    try {
      const data = await fetchBoardById(id);
      setBoard(data);
    } catch (err) {
      alert('게시글을 불러오지 못했습니다.');
      navigate('/board');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      const result = await deleteBoard(id);
      if (result.error) {
        alert(`오류: ${result.error}`);
      } else {
        alert('게시글이 삭제되었습니다.');
        navigate('/board');
      }
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = () => {
    navigate(`/board/edit/${id}`);
  };

  if (!board) return <div>로딩중...</div>;

  return (
    <div className="board-container">
      <h1>{board.title}</h1>
      <p>{board.content}</p>
      <p className="writer">작성자: {board.writer}</p>
      <span className="timestamp">{new Date(board.createdAt).toLocaleString()}</span>

      {board.file && (
        <div style={{ marginTop: '20px' }}>
          <img
            src={`http://localhost:3000/uploads/${board.file.filename}`}
            alt={board.file.originalname}
            style={{ maxWidth: '100%', maxHeight: 400 }}
          />
          <br />
          <a
            href={`http://localhost:3000/uploads/${board.file.filename}`}
            download={board.file.originalname}
            style={{ display: 'inline-block', marginTop: '10px', textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}
          >
            파일 다운로드
          </a>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleEdit} style={{ marginRight: '10px' }}>
          수정
        </button>
        <button onClick={handleDelete}>삭제</button>
      </div>
    </div>
  );
}

export default BoardDetailPage;
