export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface Profile {
  id: number;
  email: string;
  password?: string; // Password should not be returned, but sometimes is.
  name: string;
  role: 'admin' | 'customer';
  avatar: string;
  creationAt: string;
  updatedAt: string;
}