import { User } from '../auth/types';

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';

export interface Job {
  id:           number;
  title:        string;
  company:      string;
  location:     string;
  type:         JobType;
  description:  string;
  requirements: string | null;
  salary_min:   string | null;
  salary_max:   string | null;
  currency:     string;
  is_active:    boolean;
  posted_by?:   User;
  created_at?:  string;
  updated_at?:  string;
}

export interface PaginatedJobs {
  data:         Job[];
  current_page: number;
  last_page:    number;
  per_page:     number;
  total:        number;
}

export interface CreateJobPayload {
  title:         string;
  company:       string;
  location:      string;
  type:          JobType;
  description:   string;
  requirements?: string;
  salary_min?:   number;
  salary_max?:   number;
  currency?:     string;
}