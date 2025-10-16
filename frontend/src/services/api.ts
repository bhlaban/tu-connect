import axios from 'axios';
import { AuthResponse, Trip, LookupData } from '../types';

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

// Lookups API
export const lookupsAPI = {
  getAll: async (): Promise<LookupData> => {
    const response = await api.get('/lookups/all');
    return response.data;
  },

  getStreams: async () => {
    const response = await api.get('/lookups/streams');
    return response.data.streams;
  },

  getSpecies: async () => {
    const response = await api.get('/lookups/species');
    return response.data.species;
  },

  getWeatherConditions: async () => {
    const response = await api.get('/lookups/weather-conditions');
    return response.data.weatherConditions;
  },

  getWaterClarityConditions: async () => {
    const response = await api.get('/lookups/water-clarity-conditions');
    return response.data.waterClarityConditions;
  },

  getWaterLevelConditions: async () => {
    const response = await api.get('/lookups/water-level-conditions');
    return response.data.waterLevelConditions;
  },
};

// Trips API
export const tripsAPI = {
  getAll: async (): Promise<Trip[]> => {
    const response = await api.get('/trips');
    return response.data.trips;
  },

  getById: async (id: number): Promise<Trip> => {
    const response = await api.get(`/trips/${id}`);
    return response.data.trip;
  },

  create: async (trip: Partial<Trip>): Promise<Trip> => {
    const response = await api.post('/trips', trip);
    return response.data.trip;
  },

  update: async (id: number, trip: Partial<Trip>): Promise<Trip> => {
    const response = await api.put(`/trips/${id}`, trip);
    return response.data.trip;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/trips/${id}`);
  },
};

export default api;
