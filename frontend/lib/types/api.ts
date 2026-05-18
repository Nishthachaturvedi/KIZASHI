// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    name: string;
    email: string;
    created_at: string;
  };
}

// Behavior Log Types
export interface BehaviorLog {
  id: string;
  user_id: string;
  timestamp: string;
  category: string;
  duration: number;
  notes?: string;
}

export interface BehaviorLogRequest {
  category: string;
  duration: number;
  notes?: string;
}

// Analytics Types
export interface AnalyticsData {
  date: string;
  value: number;
  category?: string;
}

export interface ProductivityMetrics {
  daily_average: number;
  weekly_trend: AnalyticsData[];
  focus_sessions: number;
  break_time: number;
}

export interface LifestyleMetrics {
  sleep_hours: number;
  exercise_minutes: number;
  water_intake: number;
  nutrition_score: number;
  daily_trend: AnalyticsData[];
}

export interface MentalHealthMetrics {
  mood_score: number;
  stress_level: number;
  anxiety_level: number;
  weekly_trend: AnalyticsData[];
}

export interface DriftAnalysis {
  metric: string;
  current_value: number;
  baseline: number;
  change_percent: number;
  status: 'improving' | 'declining' | 'stable';
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  action_items: string[];
}

export interface RiskAssessment {
  overall_risk: number;
  factors: {
    category: string;
    risk_level: number;
    description: string;
  }[];
  interventions: string[];
}

export interface WeeklySummary {
  week_start: string;
  week_end: string;
  highlights: string[];
  challenges: string[];
  metrics_summary: {
    productivity: number;
    wellness: number;
    mental_health: number;
  };
  recommendations: Recommendation[];
}

// User Profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
  preferences?: {
    theme: 'light' | 'dark';
    notifications_enabled: boolean;
  };
}
