import axios from 'axios';

const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';
const client = axios.create({ baseURL: apiUrl });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;

