import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import authReducer from '../features/auth/authSlice';
import submissionReducer from '../features/submissions/submissionSlice';
import { AuthState, SubmissionState } from './types';

// Define the root state type
export interface RootState {
  auth: AuthState;
  submissions: SubmissionState;
}

const rootReducer = combineReducers({
  auth: authReducer,
  submissions: submissionReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'submissions/createSubmission/fulfilled', 
          'auth/register/fulfilled', 
          'auth/login/fulfilled'
        ],
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['items.dates'],
      },
    }),
});

// Export types
export type AppDispatch = typeof store.dispatch;
