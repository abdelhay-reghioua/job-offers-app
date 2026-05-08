import { apiClient } from '../../../core/api/client';
import { CreateJobPayload, Job, PaginatedJobs } from '../types';

export const JobsService = {
  async list(params?: { search?: string; type?: string; page?: number }): Promise<PaginatedJobs> {
    const { data } = await apiClient.get('/jobs', { params });
    return data.data as PaginatedJobs;
  },

  async find(id: number): Promise<Job> {
    const { data } = await apiClient.get(`/jobs/${id}`);
    return data.data as Job;
  },

  async create(payload: CreateJobPayload): Promise<Job> {
    const { data } = await apiClient.post('/jobs', payload);
    return data.data as Job;
  },

  async myJobs(): Promise<Job[]> {
    const { data } = await apiClient.get('/jobs/my-jobs');
    return data.data as Job[];
  },
};