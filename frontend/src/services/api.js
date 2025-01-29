import axios from 'axios';

const API_URL = 'http://localhost:4000';

export const login = async (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

export const fetchEvents = async (token) => {
  return axios.get(`${API_URL}/events`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
