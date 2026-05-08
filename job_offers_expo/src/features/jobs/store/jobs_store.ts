import { create } from 'zustand';
import { AppError } from '../../../core/api/types';
import { JobsService } from '../services/jobs_service';
import { CreateJobPayload, Job, PaginatedJobs } from '../types';

interface JobsState {
  jobs:       Job[];
  pagination: Omit<PaginatedJobs, 'data'> | null;
  currentJob: Job | null;
  loading:    boolean;
  error:      string | null;

  fetchJobs:   (params?: { search?: string; type?: string }) => Promise<void>;
  fetchJob:    (id: number)                                  => Promise<void>;
  createJob:   (payload: CreateJobPayload)                   => Promise<boolean>;
  clearError:  () => void;
}

export const useJobsStore = create<JobsState>((set) => ({
  jobs:       [],
  pagination: null,
  currentJob: null,
  loading:    false,
  error:      null,

  fetchJobs: async (params) => {
    set({ loading: true, error: null });
    try {
      const result = await JobsService.list(params);
      const { data, ...pagination } = result;
      set({ jobs: data, pagination, loading: false });
    } catch (e) {
      set({ loading: false, error: (e as AppError).message });
    }
  },

  fetchJob: async (id) => {
    set({ loading: true, error: null, currentJob: null });
    try {
      const job = await JobsService.find(id);
      set({ currentJob: job, loading: false });
    } catch (e) {
      set({ loading: false, error: (e as AppError).message });
    }
  },

  createJob: async (payload) => {
    set({ loading: true, error: null });
    try {
      await JobsService.create(payload);
      set({ loading: false });
      return true;
    } catch (e) {
      set({ loading: false, error: (e as AppError).message });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));