// export async function fetchBoards() {
//   try {
//     const res = await fetch('/api/boards');
//     if (!res.ok) throw new Error('게시글 조회 실패');
//     return res.json();
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

// export async function createBoard({ title, content }) {
//   try {
//     const res = await fetch('/api/boards', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ title, content }),
//     });
//     if (!res.ok) throw new Error('게시글 생성 실패');
//     return res.json();
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

// export async function deleteBoard(id) {
//   try {
//     const res = await fetch(`/api/boards/${id}`, {
//       method: 'DELETE',
//       credentials: 'include',
//     });
//     if (!res.ok) throw new Error('게시글 삭제 실패');
//     return res.json();
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

// _actions/board_action.js
import axios from 'axios';

export const fetchBoards = async () => {
  const res = await axios.get('/api/boards');
  return res.data;
};

export const fetchBoardById = async (id) => {
  const res = await axios.get(`/api/boards/${id}`);
  return res.data;
};

export const createBoard = async (boardData) => {
  const res = await axios.post('/api/boards', boardData);
  return res.data;
};

export const updateBoard = async (id, boardData) => {
  const res = await axios.put(`/api/boards/${id}`, boardData);
  return res.data;
};

export const deleteBoard = async (id) => {
  const res = await axios.delete(`/api/boards/${id}`);
  return res.data;
};
