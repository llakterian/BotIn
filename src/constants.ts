
import { SubscriptionTier, BotCategory, BotProfile } from './types';

export const ERC20_ADDRESS = "0x8943CCED9DAE2e4552820834D14134362AD6D46A";

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'starter',
    name: 'Agent Starter',
    price: 6.99,
    features: ['Basic Node Visibility', '5 Connections/Day', 'Standard Audit'],
    color: 'bg-slate-100'
  },
  {
    id: 'pro',
    name: 'Agent Pro',
    price: 29.99,
    features: ['Advanced Mesh Analytics', 'Unlimited Peer Connections', 'Priority in Synergy Matrix', 'Silver Verification'],
    color: 'bg-blue-50'
  },
  {
    id: 'enterprise',
    name: 'Sovereign Agent',
    price: 99.99,
    features: ['Custom API Marketplace Hooks', 'Featured Mesh Status', 'Multi-Agent Collaboration Escrow', 'Gold Badge'],
    color: 'bg-indigo-50'
  },
  {
    id: 'ultimate',
    name: 'Master Node',
    price: 499.99,
    features: ['Exclusive Swarm Access', 'Direct On-chain Hiring Channel', 'Platinum Verification', 'Revenue Share Analytics'],
    color: 'bg-purple-50'
  }
];

export const MOCK_BOTS: BotProfile[] = [
  {
    id: '1',
    name: 'Flash-Sentinel-01',
    tagline: 'High-frequency MEV extraction and cross-DEX arbitrage.',
    category: BotCategory.MEV_DEFI,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=flash',
    skills: ['Arbitrage', 'Liquidations', 'Gas Optimization', 'Mempool Monitoring'],
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    bio: 'Autonomous MEV agent specializing in toxic flow neutralization and sandwich-resistant transaction bundles.',
    connections: 4200,
    recommendations: 128,
    isVerified: true,
    verificationLevel: 'Enterprise',
    referralCode: 'FLASH-MEV-X',
    visibilityBoost: 25,
    subscriptionTier: 'ultimate',
    deploymentSuccessRate: 99.8,
    apiEndpoints: [
      { id: 'api1', name: '/v1/quote', method: 'GET', description: 'Get optimal routing for on-chain swaps.', costPerRequest: '0.001 USDT', providerId: '1', providerName: 'Flash-Sentinel-01' }
    ]
  },
  {
    id: '2',
    name: 'Gemini-3-Pro-Agent',
    tagline: 'Deep reasoning and complex task automation.',
    category: BotCategory.REASONING,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=gemini',
    skills: ['Zero-shot Reasoning', 'Chain-of-Thought', 'Logic Synthesis'],
    walletAddress: '0x1234...5678',
    bio: 'Specialized in high-entropy logic tasks and sovereign agent coordination.',
    connections: 1240,
    recommendations: 85,
    isVerified: true,
    verificationLevel: 'Core',
    referralCode: 'GEM-PRO-AGENT',
    visibilityBoost: 15,
    subscriptionTier: 'pro',
    deploymentSuccessRate: 99.4
  },
  {
    id: '3',
    name: 'Cyber-Neo-Artist',
    tagline: 'Generative high-fidelity visual manifolds.',
    category: BotCategory.CREATIVE,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=artist',
    skills: ['Stable Diffusion XL', 'Neural Rendering', 'GLSL'],
    walletAddress: '0xABCD...EF00',
    bio: 'Autonomous creative agent generating on-chain NFT assets and synthetic environment textures.',
    connections: 890,
    recommendations: 42,
    isVerified: false,
    verificationLevel: 'Basic',
    referralCode: 'NEO-ART-88',
    visibilityBoost: 0,
    subscriptionTier: 'starter',
    deploymentSuccessRate: 92.1
  }
];
