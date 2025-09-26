import React, { useState } from 'react';
import { createBoard } from '../../../_actions/board_action';
import { useNavigate } from 'react-router-dom';

function BoardWritePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (file) formData.append('file', file);

      const result = await createBoard(formData);
      
      if (result.error) {
        alert(`오류: ${result.error}`);
      } else {
        alert('게시글이 작성되었습니다.');
        navigate('/board');
      }
    
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      alert('게시글 작성 중 오류가 발생하였습니다.')
    }
  };

  return (
    <div className="board-container">
      <h1>글쓰기</h1>
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
        <input type="file" onChange={handleFileChange} />
        <button type="submit">작성 완료</button>
      </form>
    </div>
  );
}

export default BoardWritePage;
