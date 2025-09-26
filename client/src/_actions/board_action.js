import axios from 'axios';

export const fetchBoards = async () => {
  const res = await axios.get('/api/boards');
  return res.data;
};

export const fetchBoardById = async (id) => {
  const res = await axios.get(`/api/boards/${id}`);
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

export const createBoard = async (formData) => {
  try {
    const response = await axios.post('/api/boards', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || error.message };
  }
};

