import { apiClient } from '../../../core/api/client';
import { Application, ApplyPayload } from '../types';

export const ApplicationsService = {
  async apply(payload: ApplyPayload): Promise<Application> {
    const { data } = await apiClient.post('/applications', payload);
    return data.data as Application;
  },

  async myApplications(): Promise<Application[]> {
    const { data } = await apiClient.get('/applications/me');
    return data.data as Application[];
  },

  async forJob(jobId: number): Promise<Application[]> {
    const { data } = await apiClient.get(`/jobs/${jobId}/applications`);
    return data.data as Application[];
  },

  async hasApplied(jobId: number): Promise<boolean> {
    const { data } = await apiClient.get(`/jobs/${jobId}/applied`);
    return data.data.applied as boolean;
  },
};