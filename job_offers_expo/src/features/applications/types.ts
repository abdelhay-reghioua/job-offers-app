import { User } from '../auth/types';
import { Job } from '../jobs/types';

export type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected';

export interface Application {
  id:           number;
  status:       ApplicationStatus;
  cover_letter: string | null;
  resume_url:   string | null;
  applicant?:   User;
  job?:         Job;
  created_at?:  string;
  updated_at?:  string;
}

export interface ApplyPayload {
  job_offer_id: number;
  cover_letter?: string;
  resume_url?:   string;
}