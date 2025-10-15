import axios from 'axios';
import { AuthResponse, Experience } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', {
      email,
      password,
      firstName,
      lastName,
    });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

// Experiences API
export const experiencesAPI = {
  getAll: async (): Promise<Experience[]> => {
    const response = await api.get('/experiences');
    return response.data.experiences;
  },

  getById: async (id: number): Promise<Experience> => {
    const response = await api.get(`/experiences/${id}`);
    return response.data.experience;
  },

  create: async (experience: Partial<Experience>): Promise<Experience> => {
    const response = await api.post('/experiences', experience);
    return response.data.experience;
  },

  update: async (id: number, experience: Partial<Experience>): Promise<Experience> => {
    const response = await api.put(`/experiences/${id}`, experience);
    return response.data.experience;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/experiences/${id}`);
  },
};

export default api;
