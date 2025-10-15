export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Experience {
  id?: number;
  userId?: number;
  streamName: string;
  location: string;
  date: string;
  weather?: string;
  waterCondition?: string;
  fishCaught?: number;
  species?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExperienceFormData {
  streamName: string;
  location: string;
  date: string;
  weather: string;
  waterCondition: string;
  fishCaught: number;
  species: string;
  notes: string;
}
