export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  ecoPoints: number;
  avatar?: string;
}

export interface Submission {
  _id: string;
  user: string | { _id: string; name: string };
  image: string;
  wasteType: 'dry' | 'wet' | 'e-waste' | 'hazardous' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  pointsAwarded: number;
  createdAt: string;
  notes?: string;
  verifiedBy?: string | { _id: string; name: string };
  verifiedAt?: string;
  feedback?: string;
  location?: {
    type: 'Point';
    coordinates: [number, number];
    address?: string;
    city?: string;
    country?: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface SubmissionState {
  submissions: Submission[];
  currentSubmission: Submission | null;
  isLoading: boolean;
  error: string | null;
  totalPoints: number;
}

export interface RootState {
  auth: AuthState;
  submissions: SubmissionState;
}

export interface Action<T = any> {
  type: string;
  payload?: T;
  error?: any;
  meta?: any;
}

export type AppDispatch = import('./store').AppDispatch;
