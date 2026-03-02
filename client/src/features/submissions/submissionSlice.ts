import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store/store';

interface Submission {
  _id: string;
  user: string;
  image: string;
  wasteType: 'dry' | 'wet' | 'e-waste' | 'hazardous' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  pointsAwarded: number;
  createdAt: string;
}

interface SubmissionState {
  submissions: Submission[];
  currentSubmission: Submission | null;
  isLoading: boolean;
  error: string | null;
  totalPoints: number;
}

const initialState: SubmissionState = {
  submissions: [],
  currentSubmission: null,
  isLoading: false,
  error: null,
  totalPoints: 0,
};

// Async thunks
export const createSubmission = createAsyncThunk(
  'submissions/create',
  async (formData: FormData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState() as RootState;
      const response = await axios.post('/api/submissions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Submission failed');
    }
  }
);

export const getSubmissions = createAsyncThunk(
  'submissions/list',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState() as RootState;
      const response = await axios.get('/api/submissions', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch submissions');
    }
  }
);

const submissionSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    clearSubmissionError: (state) => {
      state.error = null;
    },
    setCurrentSubmission: (state, action) => {
      state.currentSubmission = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Create Submission
    builder.addCase(createSubmission.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createSubmission.fulfilled, (state, action) => {
      state.isLoading = false;
      state.submissions.unshift(action.payload);
      state.currentSubmission = action.payload;
      if (action.payload.status === 'approved') {
        state.totalPoints += action.payload.pointsAwarded;
      }
    });
    builder.addCase(createSubmission.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Get Submissions
    builder.addCase(getSubmissions.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getSubmissions.fulfilled, (state, action) => {
      state.isLoading = false;
      state.submissions = action.payload.data;
      state.totalPoints = action.payload.data
        .filter((sub: Submission) => sub.status === 'approved')
        .reduce((sum: number, sub: Submission) => sum + sub.pointsAwarded, 0);
    });
    builder.addCase(getSubmissions.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearSubmissionError, setCurrentSubmission } = submissionSlice.actions;

export const selectSubmissions = (state: RootState) => state.submissions.submissions;
export const selectCurrentSubmission = (state: RootState) => state.submissions.currentSubmission;
export const selectIsLoading = (state: RootState) => state.submissions.isLoading;
export const selectError = (state: RootState) => state.submissions.error;
export const selectTotalPoints = (state: RootState) => state.submissions.totalPoints;

export default submissionSlice.reducer;
