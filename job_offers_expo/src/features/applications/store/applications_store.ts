import { create } from 'zustand';
import { AppError } from '../../../core/api/types';
import { ApplicationsService } from '../services/applications_service';
import { Application, ApplyPayload } from '../types';

interface AppsState {
  myApplications: Application[];
  jobApplications: Application[];
  loading: boolean;
  error:   string | null;

  apply:            (payload: ApplyPayload) => Promise<boolean>;
  fetchMine:        () => Promise<void>;
  fetchForJob:      (jobId: number) => Promise<void>;
  clearError:       () => void;
}

export const useApplicationsStore = create<AppsState>((set) => ({
  myApplications: [],
  jobApplications: [],
  loading: false,
  error: null,

  apply: async (payload) => {
    set({ loading: true, error: null });
    try {
      await ApplicationsService.apply(payload);
      set({ loading: false });
      return true;
    } catch (e) {
      set({ loading: false, error: (e as AppError).message });
      return false;
    }
  },

  fetchMine: async () => {
    set({ loading: true, error: null });
    try {
      const data = await ApplicationsService.myApplications();
      set({ myApplications: data, loading: false });
    } catch (e) {
      set({ loading: false, error: (e as AppError).message });
    }
  },

  fetchForJob: async (jobId) => {
    set({ loading: true, error: null });
    try {
      const data = await ApplicationsService.forJob(jobId);
      set({ jobApplications: data, loading: false });
    } catch (e) {
      set({ loading: false, error: (e as AppError).message });
    }
  },

  clearError: () => set({ error: null }),
}));