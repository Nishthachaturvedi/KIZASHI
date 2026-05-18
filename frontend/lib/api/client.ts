import { APIResponse } from '@/lib/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL environment variable is not set');
}

class APIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & { skipAuth?: boolean } = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authentication token if available (and not skipped)
    if (!options.skipAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 - Unauthorized
    if (response.status === 401) {
      this.clearAuthToken();
      // Optionally redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    // Handle network errors
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Auth Endpoints
  async login(email: string, password: string) {
    const response = await this.request<APIResponse<any>>(
      '/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        skipAuth: true,
      }
    );

    if (response.data?.access_token) {
      this.setAuthToken(response.data.access_token);
      this.setUserEmail(email);
    }

    return response;
  }

  async register(name: string, email: string, password: string) {
    const response = await this.request<APIResponse<any>>(
      '/register',
      {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
        skipAuth: true,
      }
    );

    if (response.data?.access_token) {
      this.setAuthToken(response.data.access_token);
      this.setUserEmail(email);
    }

    return response;
  }

  async logout() {
    this.clearAuthToken();
    this.clearUserEmail();
  }

  // User Endpoints
  async getProfile() {
    const email = this.getUserEmail();
    return this.request<APIResponse<any>>(`/user/profile?email=${email}`);
  }

  // Behavior Log Endpoints
  async getBehaviorLogs(limit: number = 50, offset: number = 0) {
    const email = this.getUserEmail();
    return this.request<APIResponse<any>>(
      `/behavior/logs?user_email=${email}&limit=${limit}&offset=${offset}`
    );
  }

  async createBehaviorLog(category: string, duration: number, notes?: string) {
    const email = this.getUserEmail();
    return this.request<APIResponse<any>>(
      '/behavior/logs',
      {
        method: 'POST',
        body: JSON.stringify({ 
          user_email: email,
          category, 
          duration, 
          notes 
        }),
      }
    );
  }

  // Analytics Endpoints
  async getProductivityMetrics(days: number = 7) {
    const email = this.getUserEmail();
    return this.request<APIResponse<any>>(
      `/analytics/productivity?user_email=${email}&days=${days}`
    );
  }

  async getLifestyleMetrics(days: number = 7) {
    const email = this.getUserEmail();
    return this.request<APIResponse<any>>(
      `/analytics/lifestyle?user_email=${email}&days=${days}`
    );
  }

  async getMentalHealthMetrics(days: number = 7) {
    const email = this.getUserEmail();
    return this.request<APIResponse<any>>(
      `/analytics/mental-health?user_email=${email}&days=${days}`
    );
  }

  async getDriftAnalysis() {
    const email = this.getUserEmail();
    return this.request<APIResponse<any>>(
      `/analytics/drift?user_email=${email}`
    );
  }

  async getRecommendations() {
    const email = this.getUserEmail();
    return this.request<APIResponse<any>>(
      `/analytics/recommendations?user_email=${email}`
    );
  }

  async getRiskAssessment() {
    const email = this.getUserEmail();
    return this.request<APIResponse<any>>(
      `/analytics/risk?user_email=${email}`
    );
  }

  async getDashboardData() {
    const email = this.getUserEmail();
    return this.request<APIResponse<any>>(
      `/dashboard?user_email=${email}`
    );
  }

  async getWeeklySummary(weekStart: string) {
    const email = this.getUserEmail();
    return this.request<APIResponse<any>>(
      `/dashboard?user_email=${email}&week_start=${weekStart}`
    );
  }

  // Token Management
  private setAuthToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private clearAuthToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private setUserEmail(email: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_email', email);
    }
  }

  private getUserEmail(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('user_email') || '';
    }
    return '';
  }

  private clearUserEmail() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_email');
    }
  }

  isAuthenticated(): boolean {
    return this.getAuthToken() !== null;
  }
}

export const apiClient = new APIClient();
