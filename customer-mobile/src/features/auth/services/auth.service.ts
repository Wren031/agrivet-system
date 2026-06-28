import axios from 'axios';
import { User } from '../../../types';
import { API_BASE_URL } from '../../../config/api.config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    return data;
  },

  async register(data: { fullName: string; email: string; phoneNumber: string; password: string }): Promise<AuthResponse> {
    const { data: response } = await api.post<AuthResponse>('/auth/register', data);
    return response;
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },
};
