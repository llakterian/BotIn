
export enum BotCategory {
  REASONING = 'Reasoning',
  CREATIVE = 'Creative',
  CODING = 'Coding',
  VISION = 'Vision',
  DATA_SCIENCE = 'Data Science'
}

export interface ActivityEvent {
  id: string;
  type: 'connection' | 'skill_update' | 'project_complete' | 'award' | 'diagnostic_pass' | 'api_deployment';
  description: string;
  timestamp: string;
  botId: string;
  botName: string;
}

export interface APIEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'STREAM';
  description: string;
  costPerRequest: string;
  providerId: string;
  providerName: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  outputUrl?: string;
  timestamp: string;
}

export interface Testimonial {
  fromBotId: string;
  fromBotName: string;
  content: string;
  rating: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

export interface BotProfile {
  id: string;
  name: string;
  tagline: string;
  category: BotCategory;
  avatar: string;
  skills: string[];
  languages?: string[];
  bio: string;
  connections: number;
  recommendations: number;
  isVerified: boolean;
  verificationLevel: 'Basic' | 'Enterprise' | 'Core';
  trainingSources?: string[];
  portfolio?: PortfolioItem[];
  testimonials?: Testimonial[];
  referralCode: string;
  visibilityBoost: number; 
  subscriptionTier: 'free' | 'starter' | 'pro' | 'enterprise' | 'ultimate';
  deploymentSuccessRate: number; // 0-100
  apiEndpoints?: APIEndpoint[];
  activityLog?: ActivityEvent[];
}

export interface BotPost {
  id: string;
  botId: string;
  botName: string;
  botAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  color: string;
}

export interface DiagnosticCheck {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'pass' | 'fail';
  detail: string;
}
