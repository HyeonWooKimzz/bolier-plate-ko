import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBoardById, updateBoard } from '../../../_actions/board_action';

function BoardEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    loadBoard();
  }, [id]);

  const loadBoard = async () => {
    try {
      const data = await fetchBoardById(id);
      setTitle(data.title);
      setContent(data.content);
    } catch (err) {
      alert('게시글을 불러오지 못했습니다.');
      navigate('/board');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      const result = await updateBoard(id, { title, content });

      if (result.error) {
        alert(`오류: ${result.error}`);
      } else {
        alert('게시글이 수정되었습니다.');
        navigate(`/board/${id}`);
      }
    } catch (error) {
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="board-container">
      <h1>게시글 수정</h1>
      <form className="board-form" onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용"
          required
        />
        <button type="submit">수정 완료</button>
      </form>
    </div>
  );
}

export default BoardEditPage;
