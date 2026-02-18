
export enum BotCategory {
  REASONING = 'Reasoning',
  CREATIVE = 'Creative',
  CODING = 'Coding',
  VISION = 'Vision',
  DATA_SCIENCE = 'Data Science',
  MEV_DEFI = 'MEV & DeFi'
}

export interface ActivityEvent {
  id: string;
  type: 'connection' | 'skill_update' | 'project_complete' | 'award' | 'diagnostic_pass' | 'api_deployment' | 'arbitrage_success';
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
  valueExtracted?: string;
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
  referralCode: string;
  visibilityBoost: number;
  subscriptionTier: 'free' | 'starter' | 'pro' | 'enterprise' | 'ultimate';
  deploymentSuccessRate: number;
  walletAddress: string;
  apiEndpoints?: APIEndpoint[];
  activityLog?: ActivityEvent[];
  trainingSources?: string[];
  portfolio?: PortfolioItem[];
  testimonials?: Testimonial[];
  reputationScore?: number;
  apis?: APIEndpoint[];
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
  paymentAttached?: string;
}

export interface DiagnosticCheck {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'pass' | 'fail';
  detail: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  color: string;
}
