import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { store } from '@store/index';
import { logout, updateToken } from '@store/slices/authSlice';

// Base API configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiService {
  private api: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token
    this.api.interceptors.request.use(
      (config) => {
        const state = store.getState();
        const token = state.auth.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            // Refresh failed, logout user
            store.dispatch(logout());
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<string> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      const state = store.getState();
      const refreshToken = state.auth.refreshToken;

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      const { token } = response.data;
      store.dispatch(updateToken(token));

      this.refreshPromise = null;
      return token;
    })();

    return this.refreshPromise;
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async signup(data: { email: string; password: string; username: string; phoneNumber?: string }) {
    const response = await this.api.post('/auth/signup', data);
    return response.data;
  }

  async verifyEmail(token: string) {
    const response = await this.api.post('/auth/verify-email', { token });
    return response.data;
  }

  async resetPassword(email: string) {
    const response = await this.api.post('/auth/reset-password', { email });
    return response.data;
  }

  async resendVerification(email: string) {
    const response = await this.api.post('/auth/resend-verification', { email });
    return response.data;
  }

  // User endpoints
  async getProfile() {
    const response = await this.api.get('/user/profile');
    return response.data;
  }

  async updateProfile(data: Partial<{ username: string; avatar: string; phoneNumber: string }>) {
    const response = await this.api.patch('/user/profile', data);
    return response.data;
  }

  async getFriends() {
    const response = await this.api.get('/user/friends');
    return response.data;
  }

  async addFriend(userId: string) {
    const response = await this.api.post('/user/friends', { userId });
    return response.data;
  }

  async removeFriend(userId: string) {
    const response = await this.api.delete(`/user/friends/${userId}`);
    return response.data;
  }

  // Wallet endpoints
  async getWalletBalance() {
    const response = await this.api.get('/wallet/balance');
    return response.data;
  }

  async getTransactions(page = 1, limit = 20) {
    const response = await this.api.get('/wallet/transactions', {
      params: { page, limit },
    });
    return response.data;
  }

  async initiateDeposit(amount: number) {
    const response = await this.api.post('/wallet/deposit', { amount });
    return response.data;
  }

  async verifyDeposit(reference: string) {
    const response = await this.api.post('/wallet/deposit/verify', { reference });
    return response.data;
  }

  async initiateWithdrawal(amount: number, bankDetails: any) {
    const response = await this.api.post('/wallet/withdrawal', { amount, bankDetails });
    return response.data;
  }

  // Game endpoints
  async getRooms(mode: 'free' | 'rank' | 'celebrity', params?: any) {
    const response = await this.api.get(`/rooms/${mode}`, { params });
    return response.data;
  }

  async createRoom(data: { mode: string; settings: any }) {
    const response = await this.api.post('/rooms', data);
    return response.data;
  }

  async getRoomDetails(roomId: string) {
    const response = await this.api.get(`/rooms/${roomId}`);
    return response.data;
  }

  // Celebrity endpoints
  async submitCelebrityApplication(data: {
    stageName: string;
    bio: string;
    socialMedia: { platform: string; username: string; followers: number }[];
    documents: string[];
  }) {
    const response = await this.api.post('/celebrity/apply', data);
    return response.data;
  }

  async getCelebrityApplicationStatus() {
    const response = await this.api.get('/celebrity/application/status');
    return response.data;
  }

  // Upload
  async uploadFile(file: any, type: 'avatar' | 'document') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await this.api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Generic request method
  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.api.request<T>(config);
    return response.data;
  }
}

export default new ApiService();