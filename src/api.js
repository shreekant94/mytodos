import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Update with your backend URL

export const getTasks = async () => {
  const response = await axios.get(`${API_BASE_URL}/tasks`);
  return response.data;
};

export const addTask = async (task) => {
  const response = await axios.post(`${API_BASE_URL}/tasks`, task);
  return response.data;
};

export const updateTask = async (taskId, updatedData) => {
  const response = await axios.put(
    `${API_BASE_URL}/tasks/${taskId}`,
    updatedData
  );
  return response.data;
};

export const deleteTask = async (taskId) => {
  await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await axios.patch(`${API_BASE_URL}/tasks/${taskId}/status`, {
    status,
  });
  return response.data;
};
export const searchTasks = async (query) => {
  const response = await axios.get(`${API_BASE_URL}/tasks/search`, {
    params: { q: query },
  });
  return response.data;
};
