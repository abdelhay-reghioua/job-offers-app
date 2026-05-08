export interface User {
  id:         number;
  name:       string;
  email:      string;
  role:       'candidate' | 'employer';
  phone?:     string | null;
  avatar?:    string | null;
  created_at?: string;
}

export interface AuthResponse {
  user:  User;
  token: string;
}

export interface RegisterPayload {
  name:                  string;
  email:                 string;
  password:              string;
  password_confirmation: string;
  role:                  'candidate' | 'employer';
  phone?:                string;
}

export interface LoginPayload {
  email:    string;
  password: string;
}