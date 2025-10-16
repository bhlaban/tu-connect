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

export interface Stream {
  id: number;
  name: string;
  location?: string;
  description?: string;
}

export interface Species {
  id: number;
  name: string;
  scientificName?: string;
  description?: string;
}

export interface WeatherCondition {
  id: number;
  name: string;
  description?: string;
}

export interface WaterCondition {
  id: number;
  name: string;
  description?: string;
}

export interface LookupData {
  streams: Stream[];
  species: Species[];
  weatherConditions: WeatherCondition[];
  waterConditions: WaterCondition[];
}

export interface Experience {
  id?: number;
  userId?: number;
  streamId?: number;
  customStreamName?: string;
  streamName?: string;
  location: string;
  date: string;
  weatherConditionId?: number;
  weatherCondition?: string;
  waterConditionId?: number;
  waterCondition?: string;
  fishCaught?: number;
  speciesId?: number;
  customSpecies?: string;
  speciesName?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExperienceFormData {
  streamId?: number;
  customStreamName?: string;
  location: string;
  date: string;
  weatherConditionId?: number;
  waterConditionId?: number;
  fishCaught: number;
  speciesId?: number;
  customSpecies?: string;
  notes: string;
}
