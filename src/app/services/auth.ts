import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  access_token: string;
  user: User;
}

const isBrowser = typeof window !== 'undefined';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    if (response.data.access_token) {
      Cookies.set('token', response.data.access_token, { 
        secure: true, 
        sameSite: 'strict',
        expires: 7 // 7 days
      });
      if (isBrowser) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    return response.data;
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', { name, email, password });
    if (response.data.access_token) {
      Cookies.set('token', response.data.access_token, { 
        secure: true, 
        sameSite: 'strict',
        expires: 7 // 7 days
      });
      if (isBrowser) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      const token = Cookies.get('token');
      if (token) {
        await api.post('/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } finally {
      // Always clear the data, even if the API call fails
      Cookies.remove('token');
      if (isBrowser) {
        localStorage.removeItem('user');
        // Clear any other auth-related data
        sessionStorage.clear();
      }
    }
  },

  getCurrentUser(): User | null {
    if (!isBrowser) return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken(): string | null {
    const token = Cookies.get('token');
    return token || null;
  },

  isAuthenticated(): boolean {
    return !!Cookies.get('token');
  },
}; 