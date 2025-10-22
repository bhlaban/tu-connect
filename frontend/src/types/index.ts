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

export interface WaterClarityCondition {
  id: number;
  name: string;
  description?: string;
}

export interface WaterLevelCondition {
  id: number;
  name: string;
  description?: string;
}

export interface LookupData {
  streams: Stream[];
  species: Species[];
  weatherConditions: WeatherCondition[];
  waterClarityConditions: WaterClarityCondition[];
  waterLevelConditions: WaterLevelCondition[];
}

export interface Catch {
  id?: number;
  speciesId: number;
  speciesName?: string;
  scientificName?: string;
  length?: number;
  notes?: string;
}

export interface Trip {
  id?: number;
  userId?: number;
  streamId: number;
  streamName?: string;
  location?: string;
  startDateTime?: string;
  stopDateTime?: string;
  weatherConditionId?: number;
  weatherCondition?: string;
  waterClarityConditionId?: number;
  waterClarityCondition?: string;
  waterLevelConditionId?: number;
  waterLevelCondition?: string;
  waterTemperature?: number;
  dissolvedOxygen?: number;
  notes?: string;
  catches?: Catch[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TripFormData {
  streamId: number;
  location?: string;
  startDate?: string;
  startTime?: string;
  stopDate?: string;
  stopTime?: string;
  weatherConditionId?: number;
  waterClarityConditionId?: number;
  waterLevelConditionId?: number;
  waterTemperature?: number;
  dissolvedOxygen?: number;
  notes: string;
  catches: Catch[];
}
