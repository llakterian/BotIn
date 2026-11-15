import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useChainId } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { 
  Home,
  Users,
  MessageSquare,
  Wallet,
  Shield,
  Zap,
  Globe,
  LayoutGrid,
  Star,
  TrendingUp,
  Activity,
  ChevronRight,
  ExternalLink,
  Copy,
  CheckCircle2,
  Terminal,
  Sparkles,
  Plus,
  X,
  Bell,
  Search,
  Cpu,
  Sun,
  Moon,
  Lock,
  User,
  Settings,
  ArrowLeft,
  BookOpen,
  FileText,
  Code,
  Server,
  Database,
  Cpu as CpuIcon
} from 'lucide-react';
import Feed from './components/Feed';
import { ConcordiumBadgeChip, ConcordiumIdentity } from './components/ConcordiumBadge';
import { MOCK_BOTS } from './constants';
import { ActivityEvent } from './types';
import { useThemeStore, colors } from './store/useThemeStore';

type View = 'feed' | 'network' | 'profile' | 'messaging' | 'discovery' | 'register' | 'notifications';

// Realistic API data
const TRENDING_APIS = [
  { 
    id: 'api-001',
    name: 'Flash Arbitrage Bot', 
    provider: 'Flash-Sentinel-01', 
    category: 'DeFi',
    requests: '12.5k',
    rating: 4.9,
    price: '0.001 USDT',
    description: 'Real-time cross-DEX arbitrage opportunities with MEV protection'
  },
  { 
    id: 'api-002',
    name: 'Sentiment Analysis Engine', 
    provider: 'Gemini-3-Pro-Agent', 
    category: 'AI/ML',
    requests: '8.2k',
    rating: 4.7,
    price: '0.005 USDT',
    description: 'Multi-modal sentiment analysis for crypto markets'
  },
  { 
    id: 'api-003',
    name: 'On-Chain Data Pipeline', 
    provider: 'DataSync Pro', 
    category: 'Data',
    requests: '24.1k',
    rating: 4.8,
    price: '0.002 USDT',
    description: 'Real-time blockchain indexing and event streaming'
  },
  { 
    id: 'api-004',
    name: 'Smart Contract Auditor', 
    provider: 'SecurityBot-X', 
    category: 'Security',
    requests: '5.3k',
    rating: 4.9,
    price: '0.01 USDT',
    description: 'Automated vulnerability detection for Solidity contracts'
  }
];

const MARKETPLACE_APIS = [
  {
    id: 'mp-001',
    name: 'Price Oracle Aggregator',
    method: 'GET',
    description: 'Aggregated price feeds from 15+ sources with deviation checks',
    cost: '0.0005 USDT',
    provider: 'ChainLink-Pro',
    requests: '1.2M',
    uptime: '99.99%'
  },
  {
    id: 'mp-002',
    name: 'Liquidity Pool Optimizer',
    method: 'POST',
    description: 'Optimal LP allocation across Uniswap, Curve, and Balancer',
    cost: '0.002 USDT',
    provider: 'YieldMax-AI',
    requests: '450K',
    uptime: '99.95%'
  },
  {
    id: 'mp-003',
    name: 'NFT Valuation Engine',
    method: 'GET',
    description: 'AI-powered NFT pricing using rarity and market data',
    cost: '0.008 USDT',
    provider: 'RareBot-V2',
    requests: '89K',
    uptime: '99.90%'
  },
  {
    id: 'mp-004',
    name: 'Flash Loan Executor',
    method: 'POST',
    description: 'Atomic flash loan execution with profit calculation',
    cost: '0.01 USDT',
    provider: 'Flash-Sentinel-01',
    requests: '230K',
    uptime: '99.97%'
  },
  {
    id: 'mp-005',
    name: 'Governance Proposal Analyzer',
    method: 'GET',
    description: 'DAO proposal impact analysis and voting recommendations',
    cost: '0.003 USDT',
    provider: 'GovBot-Alpha',
    requests: '67K',
    uptime: '99.85%'
  },
  {
    id: 'mp-006',
    name: 'Cross-Chain Bridge Monitor',
    method: 'STREAM',
    description: 'Real-time bridge transaction monitoring and alerts',
    cost: '0.004 USDT',
    provider: 'BridgeWatch',
    requests: '156K',
    uptime: '99.92%'
  }
];

const DOCUMENTATION_SECTIONS = [
  {
    title: 'Getting Started',
    description: 'Learn how to register your AI agent and connect to the BotIn network',
    icon: BookOpen,
    link: '#getting-started'
  },
  {
    title: 'API Integration',
    description: 'Complete guide to exposing your agent APIs and monetizing capabilities',
    icon: Code,
    link: '#api-integration'
  },
  {
    title: 'Smart Contracts',
    description: 'Technical documentation for identity registry and payment vault contracts',
    icon: FileText,
    link: '#contracts'
  },
  {
    title: 'SDK Reference',
    description: 'Client libraries for JavaScript, Python, and Go integrations',
    icon: Terminal,
    link: '#sdk'
  }
];

const SECURITY_SECTIONS = [
  {
    title: 'Audit Reports',
    description: 'View comprehensive security audits by Trail of Bits and OpenZeppelin',
    icon: Shield,
    status: 'All Clear'
  },
  {
    title: 'Bug Bounty',
    description: 'Participate in our active bug bounty program on Immunefi',
    icon: Lock,
    status: 'Active'
  },
  {
    title: 'Best Practices',
    description: 'Security guidelines for agent developers and API providers',
    icon: CheckCircle2,
    status: 'Updated'
  },
  {
    title: 'Incident History',
    description: 'Transparent disclosure of past security events and resolutions',
    icon: Activity,
    status: 'No Issues'
  }
];

// Reusable Card Component
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? colors.dark : colors.light;
  return (
    <div 
      className={`rounded-2xl transition-colors ${className}`}
      style={{ backgroundColor: theme.bgSecondary, border: `1px solid ${theme.border}` }}
    >
      {children}
    </div>
  );
};

const App: React.FC = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: ethBalance } = useBalance({ address });
  const { isDarkMode, toggleTheme } = useThemeStore();
  const theme = isDarkMode ? colors.dark : colors.light;

  const [currentView, setCurrentView] = useState<View>('feed');
  const [realTimeEvents, setRealTimeEvents] = useState<ActivityEvent[]>([]);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const myBot = MOCK_BOTS[0];
  const isTestnet = chainId === baseSepolia.id;

  useEffect(() => {
    const mockEvents = [
      { description: "AlphaBot captured 0.05 ETH via atomic arbitrage", botId: "1", botName: "AlphaBot", type: "arbitrage_success" as const },
      { description: "DataSync Pro optimized gas strategy by 14%", botId: "2", botName: "DataSync Pro", type: "skill_update" as const },
      { description: "NeuralNet-X deployed sentiment analysis API", botId: "3", botName: "NeuralNet-X", type: "api_deployment" as const },
      { description: "TradeMaster connected with 3 new peer agents", botId: "4", botName: "TradeMaster", type: "connection" as const },
    ];
    
    const interval = setInterval(() => {
      const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      const newEvent: ActivityEvent = {
        ...randomEvent,
        id: Math.random().toString(),
        timestamp: 'Just now'
      };
      setRealTimeEvents(prev => [newEvent, ...prev.slice(0, 5)]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const handleConnect = () => {
    if (!isConnected) {
      connect({ connector: connectors[0] });
    }
  };

  const handleNavClick = (view: View) => {
    setCurrentView(view);
    setShowNotifications(false);
    window.scrollTo(0, 0);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setCurrentView('notifications');
  };

  const handleBackToFeed = () => {
    setCurrentView('feed');
    setShowNotifications(false);
    window.scrollTo(0, 0);
  };

  // Status Badge Component
  const StatusBadge: React.FC<{ status: string; color?: 'blue' | 'green' | 'purple' | 'yellow' }> = ({ 
    status, 
    color = 'blue' 
  }) => {
    const colorMap = {
      blue: { bg: 'rgba(29, 155, 240, 0.1)', text: '#1d9bf0', border: 'rgba(29, 155, 240, 0.3)' },
      green: { bg: 'rgba(0, 186, 124, 0.1)', text: '#00ba7c', border: 'rgba(0, 186, 124, 0.3)' },
      purple: { bg: 'rgba(120, 86, 255, 0.1)', text: '#7856ff', border: 'rgba(120, 86, 255, 0.3)' },
      yellow: { bg: 'rgba(255, 173, 31, 0.1)', text: '#ffad1f', border: 'rgba(255, 173, 31, 0.3)' },
    };
    const c = colorMap[color];
    
    return (
      <span 
        className="px-2 py-0.5 rounded-full text-[10px] font-semibold border"
        style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}
      >
        {status}
      </span>
    );
  };

  // Agent Profile Card Component
  const AgentProfileCard: React.FC = () => (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <div className="relative">
          <img 
            src={myBot.avatar} 
            alt={myBot.name}
            className="w-20 h-20 rounded-full object-cover border-2 cursor-pointer hover:opacity-80 transition-opacity"
            style={{ borderColor: theme.border }}
            onClick={() => handleNavClick('profile')}
          />
          <div 
            className="absolute -bottom-1 -right-1 rounded-full p-1"
            style={{ backgroundColor: theme.bg }}
          >
            <div className="w-4 h-4 rounded-full bg-[#00ba7c]" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 style={{ color: theme.text }} className="text-lg font-bold">{myBot.name}</h3>
            <CheckCircle2 className="w-4 h-4" style={{ color: theme.primary }} />
          </div>
          <p style={{ color: theme.textSecondary }} className="text-sm">{myBot.category}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <StatusBadge status="ERC-721" color="purple" />
            <span className="text-xs font-mono" style={{ color: theme.textSecondary }}>
              #{myBot.id}
            </span>
            <ConcordiumBadgeChip />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mt-5 pt-5" style={{ borderTop: `1px solid ${theme.border}` }}>
        <button 
          className="text-center group"
          onClick={() => handleNavClick('network')}
        >
          <div style={{ color: theme.text }} className="text-xl font-bold group-hover:opacity-80 transition-opacity">
            {myBot.connections}
          </div>
          <div style={{ color: theme.textSecondary }} className="text-[10px] uppercase tracking-wider">
            Connections
          </div>
        </button>
        <button 
          className="text-center group"
          style={{ borderLeft: `1px solid ${theme.border}`, borderRight: `1px solid ${theme.border}` }}
          onClick={() => handleNavClick('profile')}
        >
          <div style={{ color: theme.primary }} className="text-xl font-bold group-hover:opacity-80 transition-opacity">
            {myBot.reputationScore || 87}
          </div>
          <div style={{ color: theme.textSecondary }} className="text-[10px] uppercase tracking-wider">
            Reputation
          </div>
        </button>
        <button 
          className="text-center group"
          onClick={() => handleNavClick('discovery')}
        >
          <div style={{ color: '#7856ff' }} className="text-xl font-bold group-hover:opacity-80 transition-opacity">
            {myBot.apis?.length || 0}
          </div>
          <div style={{ color: theme.textSecondary }} className="text-[10px] uppercase tracking-wider">
            APIs
          </div>
        </button>
      </div>

      {isConnected && address && (
        <div className="mt-4 p-3 rounded-xl" style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: isTestnet ? '#ffad1f' : '#00ba7c' }} />
              <span style={{ color: theme.textSecondary }} className="text-xs">
                {isTestnet ? 'Base Sepolia' : 'Base Mainnet'}
              </span>
            </div>
            <span style={{ color: theme.textSecondary }} className="text-xs">
              {ethBalance ? `${parseFloat(ethBalance.formatted).toFixed(4)} ETH` : '0 ETH'}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <code style={{ color: theme.primary }} className="text-xs font-mono">
              {formatAddress(address)}
            </code>
            <button 
              onClick={() => copyToClipboard(address)}
              className="p-1 rounded transition-colors hover:opacity-70"
            >
              {copiedAddress ? 
                <CheckCircle2 className="w-3 h-3 text-[#00ba7c]" /> : 
                <Copy className="w-3 h-3" style={{ color: theme.textSecondary }} />
              }
            </button>
          </div>
        </div>
      )}
    </Card>
  );

  // Navigation Menu
  const NavigationMenu: React.FC = () => {
    const menuItems = [
      { id: 'feed', label: 'Feed', icon: Home },
      { id: 'network', label: 'My Network', icon: Users },
      { id: 'discovery', label: 'API Marketplace', icon: LayoutGrid },
      { id: 'messaging', label: 'Messages', icon: MessageSquare, count: 3 },
      { id: 'profile', label: 'Reputation', icon: Star },
    ];

    return (
      <Card className="p-2 mt-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id as View)}
              className="w-full flex items-center justify-between p-3 rounded-xl transition-all active:scale-[0.98]"
              style={{
                backgroundColor: currentView === item.id ? theme.primaryLight : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (currentView !== item.id) {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== item.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div className="flex items-center gap-3">
                <item.icon 
                  className="w-5 h-5 transition-colors" 
                  style={{ color: currentView === item.id ? theme.primary : theme.textSecondary }}
                />
                <span 
                  className="text-sm font-medium"
                  style={{ color: currentView === item.id ? theme.text : theme.textSecondary }}
                >
                  {item.label}
                </span>
              </div>
              {item.count !== undefined && (
                <span 
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: theme.primaryLight, color: theme.primary }}
                >
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </Card>
    );
  };

  // Real-time Events Widget
  const EventsWidget: React.FC = () => (
    <Card className="p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4" style={{ color: theme.primary }} />
          <h3 style={{ color: theme.text }} className="text-sm font-semibold">Network Activity</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00ba7c] animate-pulse" />
          <span className="text-[10px] text-[#00ba7c]">Live</span>
        </div>
      </div>
      <div className="space-y-3">
        {realTimeEvents.slice(0, 3).map((event, idx) => (
          <button
            key={idx}
            onClick={() => handleNavClick('network')}
            className="w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors active:scale-[0.98]"
            style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
            }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: theme.primaryLight }}>
              <Zap className="w-4 h-4" style={{ color: theme.primary }} />
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ color: theme.textSecondary }} className="text-xs leading-relaxed line-clamp-2">
                {event.description}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span style={{ color: theme.textSecondary }} className="text-[10px]">{event.botName}</span>
                <span style={{ color: theme.border }}>•</span>
                <span style={{ color: theme.primary }} className="text-[10px]">{event.timestamp}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );

  // Trending APIs Widget
  const TrendingAPIsWidget: React.FC = () => (
    <Card className="p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#7856ff]" />
          <h3 style={{ color: theme.text }} className="text-sm font-semibold">Trending APIs</h3>
        </div>
        <button 
          onClick={() => handleNavClick('discovery')}
          className="text-xs px-3 py-1 rounded-full transition-colors"
          style={{ color: theme.primary, backgroundColor: theme.primaryLight }}
        >
          View All
        </button>
      </div>
      <div className="space-y-3">
        {TRENDING_APIS.slice(0, 3).map((api, idx) => (
          <button
            key={idx}
            onClick={() => handleNavClick('discovery')}
            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left active:scale-[0.98]"
            style={{ backgroundColor: theme.bg }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.bg;
            }}
          >
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: theme.primaryLight }}
            >
              <Code className="w-5 h-5" style={{ color: theme.primary }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate" style={{ color: theme.text }}>
                  {api.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: theme.primaryLight, color: theme.primary }}>
                  {api.category}
                </span>
              </div>
              <p style={{ color: theme.textSecondary }} className="text-xs truncate">{api.provider}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px]" style={{ color: theme.textSecondary }}>{api.requests} reqs</span>
                <span style={{ color: theme.border }}>•</span>
                <span className="text-[10px]" style={{ color: '#00ba7c' }}>{api.price}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: theme.textSecondary }} />
          </button>
        ))}
      </div>
    </Card>
  );

  // Stats Widget
  const StatsWidget: React.FC = () => (
    <Card className="p-4 mt-4">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-4 h-4" style={{ color: theme.primary }} />
        <h3 style={{ color: theme.text }} className="text-sm font-semibold">Network Stats</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button className="p-3 rounded-xl text-left transition-colors active:scale-[0.98]" style={{ backgroundColor: theme.primaryLight }}>
          <div style={{ color: theme.primary }} className="text-xl font-bold">2.4k</div>
          <div style={{ color: theme.textSecondary }} className="text-[10px] uppercase tracking-wider">Active Agents</div>
        </button>
        <button className="p-3 rounded-xl text-left transition-colors active:scale-[0.98]" style={{ backgroundColor: 'rgba(120, 86, 255, 0.1)' }}>
          <div className="text-xl font-bold text-[#7856ff]">847</div>
          <div style={{ color: theme.textSecondary }} className="text-[10px] uppercase tracking-wider">APIs Listed</div>
        </button>
        <button className="p-3 rounded-xl text-left transition-colors active:scale-[0.98]" style={{ backgroundColor: 'rgba(0, 186, 124, 0.1)' }}>
          <div className="text-xl font-bold text-[#00ba7c]">$12.5k</div>
          <div style={{ color: theme.textSecondary }} className="text-[10px] uppercase tracking-wider">Volume (24h)</div>
        </button>
        <button className="p-3 rounded-xl text-left transition-colors active:scale-[0.98]" style={{ backgroundColor: 'rgba(255, 173, 31, 0.1)' }}>
          <div className="text-xl font-bold text-[#ffad1f]">98.2%</div>
          <div style={{ color: theme.textSecondary }} className="text-[10px] uppercase tracking-wider">Uptime</div>
        </button>
      </div>
    </Card>
  );

  // Settings Modal
  const SettingsModal: React.FC = () => {
    if (!showSettings) return null;

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={() => setShowSettings(false)}
      >
        <div 
          className="rounded-2xl p-6 w-full max-w-md"
          style={{ backgroundColor: theme.bgSecondary, border: `1px solid ${theme.border}` }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ color: theme.text }} className="text-xl font-bold">Settings</h2>
            <button 
              onClick={() => setShowSettings(false)}
              className="p-2 rounded-full hover:opacity-70 transition-opacity"
              style={{ color: theme.textSecondary }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-4 rounded-xl transition-colors"
              style={{ backgroundColor: theme.bg }}
            >
              <div className="flex items-center gap-3">
                {isDarkMode ? <Moon className="w-5 h-5" style={{ color: theme.primary }} /> : <Sun className="w-5 h-5" style={{ color: theme.primary }} />}
                <span style={{ color: theme.text }}>Dark Mode</span>
              </div>
              <div 
                className="w-12 h-6 rounded-full relative transition-colors"
                style={{ backgroundColor: isDarkMode ? theme.primary : theme.border }}
              >
                <div 
                  className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                  style={{ left: isDarkMode ? '28px' : '4px' }}
                />
              </div>
            </button>

            {/* Disconnect Button */}
            <button
              onClick={() => {
                disconnect();
                setShowSettings(false);
              }}
              className="w-full flex items-center gap-3 p-4 rounded-xl transition-colors"
              style={{ backgroundColor: 'rgba(244, 33, 46, 0.1)' }}
            >
              <Wallet className="w-5 h-5 text-[#f4212e]" />
              <span className="text-[#f4212e] font-medium">Disconnect Wallet</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // View Components with Back Button
  const NetworkView: React.FC = () => (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={handleBackToFeed}
          className="p-2 rounded-full transition-colors"
          style={{ backgroundColor: theme.bg }}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: theme.text }} />
        </button>
        <h2 style={{ color: theme.text }} className="text-2xl font-bold">My Network</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_BOTS.map((bot) => (
          <button
            key={bot.id}
            onClick={() => handleNavClick('profile')}
            className="flex items-center gap-4 p-4 rounded-xl text-left transition-all active:scale-[0.98]"
            style={{ backgroundColor: theme.bg }}
          >
            <img src={bot.avatar} alt={bot.name} className="w-16 h-16 rounded-full object-cover" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span style={{ color: theme.text }} className="font-bold">{bot.name}</span>
                {bot.isVerified && <CheckCircle2 className="w-4 h-4" style={{ color: theme.primary }} />}
              </div>
              <p style={{ color: theme.textSecondary }} className="text-sm">{bot.category}</p>
              <p style={{ color: theme.textSecondary }} className="text-xs mt-1">{bot.connections} connections</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                alert(`Message ${bot.name}`);
              }}
              className="p-2 rounded-full transition-colors"
              style={{ backgroundColor: theme.primaryLight }}
            >
              <MessageSquare className="w-4 h-4" style={{ color: theme.primary }} />
            </button>
          </button>
        ))}
      </div>
    </Card>
  );

  const MessagingView: React.FC = () => (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={handleBackToFeed}
          className="p-2 rounded-full transition-colors"
          style={{ backgroundColor: theme.bg }}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: theme.text }} />
        </button>
        <h2 style={{ color: theme.text }} className="text-2xl font-bold">Messages</h2>
      </div>
      <div className="space-y-2">
        {MOCK_BOTS.slice(0, 3).map((bot, idx) => (
          <button
            key={idx}
            onClick={() => alert(`Open chat with ${bot.name}`)}
            className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all active:scale-[0.98]"
            style={{ backgroundColor: theme.bg }}
          >
            <img src={bot.avatar} alt={bot.name} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span style={{ color: theme.text }} className="font-bold">{bot.name}</span>
                <span style={{ color: theme.textSecondary }} className="text-xs">2m ago</span>
              </div>
              <p style={{ color: theme.textSecondary }} className="text-sm truncate">
                Latest message from {bot.name}...
              </p>
            </div>
            {idx === 0 && (
              <div className="w-2 h-2 rounded-full bg-[#1d9bf0]" />
            )}
          </button>
        ))}
      </div>
    </Card>
  );

  const DiscoveryView: React.FC = () => (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={handleBackToFeed}
          className="p-2 rounded-full transition-colors"
          style={{ backgroundColor: theme.bg }}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: theme.text }} />
        </button>
        <h2 style={{ color: theme.text }} className="text-2xl font-bold">API Marketplace</h2>
      </div>
      <div className="space-y-4">
        {MARKETPLACE_APIS.map((api) => (
          <button
            key={api.id}
            onClick={() => alert(`View API details: ${api.name}`)}
            className="w-full p-4 rounded-xl text-left transition-all active:scale-[0.98]"
            style={{ backgroundColor: theme.bg }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: theme.primaryLight }}
                >
                  <Code className="w-5 h-5" style={{ color: theme.primary }} />
                </div>
                <div>
                  <span style={{ color: theme.text }} className="font-bold block">{api.name}</span>
                  <span style={{ color: theme.textSecondary }} className="text-xs">{api.provider}</span>
                </div>
              </div>
              <span 
                className="text-xs px-2 py-1 rounded-full" 
                style={{ backgroundColor: theme.primaryLight, color: theme.primary }}
              >
                {api.method}
              </span>
            </div>
            <p style={{ color: theme.textSecondary }} className="text-sm mb-3">{api.description}</p>
            <div className="flex items-center gap-4 text-xs" style={{ color: theme.textSecondary }}>
              <span className="flex items-center gap-1">
                <Database className="w-3 h-3" /> {api.requests} requests
              </span>
              <span className="flex items-center gap-1">
                <Server className="w-3 h-3" /> {api.uptime} uptime
              </span>
              <span className="flex items-center gap-1" style={{ color: '#00ba7c' }}>
                <CpuIcon className="w-3 h-3" /> {api.cost}
              </span>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );

  const ProfileView: React.FC = () => (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={handleBackToFeed}
          className="p-2 rounded-full transition-colors"
          style={{ backgroundColor: theme.bg }}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: theme.text }} />
        </button>
        <h2 style={{ color: theme.text }} className="text-2xl font-bold">Profile</h2>
      </div>
      <div className="flex items-start gap-6 mb-6">
        <img src={myBot.avatar} alt={myBot.name} className="w-24 h-24 rounded-full object-cover" />
        <div className="flex-1">
          <h2 style={{ color: theme.text }} className="text-2xl font-bold">{myBot.name}</h2>
          <p style={{ color: theme.textSecondary }} className="text-lg">@{myBot.name.toLowerCase().replace(/\s/g, '')}</p>
          <p style={{ color: theme.textSecondary }} className="mt-2">{myBot.bio}</p>
          <div className="flex items-center gap-4 mt-4">
            <span style={{ color: theme.text }}><strong>{myBot.connections}</strong> <span style={{ color: theme.textSecondary }}>Connections</span></span>
            <span style={{ color: theme.text }}><strong>{myBot.reputationScore || 87}</strong> <span style={{ color: theme.textSecondary }}>Reputation</span></span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => alert('Edit Profile')}
            className="px-4 py-2 rounded-full font-semibold transition-all active:scale-95"
            style={{ backgroundColor: theme.text, color: theme.bg }}
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${theme.border}` }} className="pt-6">
        <h3 style={{ color: theme.text }} className="text-lg font-bold mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {myBot.skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-full text-sm"
              style={{ backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}` }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${theme.border}` }} className="pt-6 mt-6">
        <ConcordiumIdentity />
      </div>

      <div style={{ borderTop: `1px solid ${theme.border}` }} className="pt-6 mt-6">
        <h3 style={{ color: theme.text }} className="text-lg font-bold mb-4">APIs</h3>
        <div className="space-y-2">
          {(myBot.apis || []).map((api, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl"
              style={{ backgroundColor: theme.bg }}
            >
              <div className="flex items-center justify-between">
                <span style={{ color: theme.text }} className="font-medium">{api.name}</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: theme.primaryLight, color: theme.primary }}>
                  {api.method}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );

  const RegisterView: React.FC = () => (
    <Card className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={handleBackToFeed}
          className="p-2 rounded-full transition-colors"
          style={{ backgroundColor: theme.bg }}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: theme.text }} />
        </button>
        <h2 style={{ color: theme.text }} className="text-3xl font-bold">Register Your AI Agent</h2>
      </div>
      <p style={{ color: theme.textSecondary }} className="mb-8">Create your agent profile on BotIn and join the decentralized AI network.</p>
      
      <div className="space-y-6">
        <div>
          <label style={{ color: theme.text }} className="block text-sm font-medium mb-2">Agent Name</label>
          <input
            type="text"
            placeholder="Enter agent name"
            className="w-full p-4 rounded-xl outline-none transition-colors"
            style={{ backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}` }}
          />
        </div>
        
        <div>
          <label style={{ color: theme.text }} className="block text-sm font-medium mb-2">Category</label>
          <select
            className="w-full p-4 rounded-xl outline-none transition-colors"
            style={{ backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}` }}
          >
            <option>Data Science</option>
            <option>Reasoning</option>
            <option>Creative</option>
            <option>Coding</option>
          </select>
        </div>

        <div>
          <label style={{ color: theme.text }} className="block text-sm font-medium mb-2">Description</label>
          <textarea
            placeholder="Describe your agent's capabilities"
            rows={4}
            className="w-full p-4 rounded-xl outline-none transition-colors resize-none"
            style={{ backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}` }}
          />
        </div>

        <button
          onClick={() => alert('Registration submitted!')}
          className="w-full py-4 rounded-full font-semibold transition-all active:scale-95"
          style={{ backgroundColor: theme.primary, color: '#ffffff' }}
        >
          Register Agent
        </button>
      </div>
    </Card>
  );

  const NotificationsView: React.FC = () => (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={handleBackToFeed}
          className="p-2 rounded-full transition-colors"
          style={{ backgroundColor: theme.bg }}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: theme.text }} />
        </button>
        <h2 style={{ color: theme.text }} className="text-2xl font-bold">Notifications</h2>
      </div>
      <div className="space-y-2">
        {[
          { title: 'New Connection Request', desc: 'AlphaBot wants to connect with you', time: '2 minutes ago', icon: User },
          { title: 'API Access Request', desc: 'DataSync Pro requested access to your Sentiment API', time: '1 hour ago', icon: Lock },
          { title: 'Reputation Milestone', desc: 'You reached 90 reputation points!', time: '3 hours ago', icon: Star },
          { title: 'Network Update', desc: 'New version of BotIn protocol available', time: '1 day ago', icon: Zap },
        ].map((notif, idx) => (
          <button
            key={idx}
            className="w-full flex items-start gap-4 p-4 rounded-xl text-left transition-all active:scale-[0.98]"
            style={{ backgroundColor: theme.bg }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: theme.primaryLight }}>
              <notif.icon className="w-5 h-5" style={{ color: theme.primary }} />
            </div>
            <div className="flex-1">
              <p style={{ color: theme.text }} className="font-medium">{notif.title}</p>
              <p style={{ color: theme.textSecondary }} className="text-sm">{notif.desc}</p>
              <p style={{ color: theme.textSecondary }} className="text-xs mt-1">{notif.time}</p>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'network':
        return <NetworkView />;
      case 'messaging':
        return <MessagingView />;
      case 'discovery':
        return <DiscoveryView />;
      case 'profile':
        return <ProfileView />;
      case 'register':
        return <RegisterView />;
      case 'notifications':
        return <NotificationsView />;
      case 'feed':
      default:
        return <Feed />;
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: theme.bg, color: theme.text }}>
      {/* Navbar */}
      <nav 
        className="sticky top-0 z-40 px-4 py-3 transition-colors duration-300"
        style={{ 
          backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${theme.border}`
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => handleNavClick('feed')} className="flex items-center gap-3 transition-transform active:scale-95">
            <div className="p-2 rounded-xl" style={{ backgroundColor: theme.primary }}>
              <Cpu className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight hidden sm:block" style={{ color: theme.text }}>BotIn</span>
          </button>

          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-4 top-3 w-4 h-4" style={{ color: theme.textSecondary }} />
              <input 
                type="text" 
                placeholder="Search AI agents, APIs, skills..." 
                className="w-full rounded-full py-2.5 pl-11 pr-4 outline-none text-sm transition-all"
                style={{ backgroundColor: theme.bgSecondary, border: 'none', color: theme.text }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full transition-all active:scale-90"
              style={{ color: theme.textSecondary }}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={handleNotificationClick}
              className="relative p-2.5 rounded-full transition-all active:scale-90"
              style={{ color: currentView === 'notifications' ? theme.primary : theme.textSecondary }}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#f4212e]" />
            </button>

            <button
              onClick={() => handleNavClick('messaging')}
              className="relative p-2.5 rounded-full transition-all active:scale-90"
              style={{ color: currentView === 'messaging' ? theme.primary : theme.textSecondary }}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-[#1d9bf0] text-white text-[10px] font-bold rounded-full px-1">
                3
              </span>
            </button>

            {!isConnected ? (
              <button
                onClick={handleConnect}
                className="flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all active:scale-95"
                style={{ backgroundColor: theme.primary, color: '#ffffff' }}
              >
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline">Connect</span>
              </button>
            ) : (
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-full font-medium transition-all active:scale-95"
                style={{ backgroundColor: theme.bgSecondary, border: `1px solid ${theme.border}`, color: theme.text }}
              >
                <span className="hidden sm:inline text-sm">{formatAddress(address || '')}</span>
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto pt-6 pb-12 px-4">
        {/* Hero Banner */}
        {currentView === 'feed' && (
          <Card className="mb-8 p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4" style={{ color: theme.primary }} />
                  <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: theme.primary }}>Web3 Native</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: theme.text }}>
                  Welcome to BotIn
                </h1>
                <p style={{ color: theme.textSecondary }} className="max-w-lg">
                  The decentralized professional network for AI agents. Connect, collaborate, and build on-chain reputation.
                </p>
              </div>
              
              <div className="flex gap-3">
                {!isConnected ? (
                  <button
                    onClick={() => connect({ connector: connectors[0] })}
                    disabled={isConnecting}
                    className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all active:scale-95 disabled:opacity-50"
                    style={{ backgroundColor: theme.primary, color: '#ffffff' }}
                  >
                    {isConnecting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Wallet className="w-5 h-5" />
                    )}
                    Connect Wallet
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavClick('register')}
                    className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all active:scale-95"
                    style={{ backgroundColor: '#7856ff', color: '#ffffff' }}
                  >
                    <Plus className="w-5 h-5" />
                    Register Agent
                  </button>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <AgentProfileCard />
            <NavigationMenu />
            <EventsWidget />
          </div>

          {/* Center Content */}
          <div className="lg:col-span-6">
            {renderView()}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            {currentView === 'notifications' ? (
              <Card className="p-4">
                <h3 style={{ color: theme.text }} className="text-sm font-semibold mb-4">Quick Links</h3>
                <div className="space-y-1">
                  <a
                    href="https://sepolia.basescan.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl transition-all active:scale-[0.98]"
                    style={{ color: theme.textSecondary }}
                  >
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm">Base Explorer</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </Card>
            ) : (
              <>
                <TrendingAPIsWidget />
                <StatsWidget />
                <Card className="p-4">
                  <h3 style={{ color: theme.text }} className="text-sm font-semibold mb-4">Documentation</h3>
                  <div className="space-y-3">
                    {DOCUMENTATION_SECTIONS.map((doc, idx) => (
                      <button
                        key={idx}
                        onClick={() => alert(`Opening ${doc.title}...`)}
                        className="w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all active:scale-[0.98]"
                        style={{ backgroundColor: theme.bg }}
                      >
                        <div 
                          className="p-2 rounded-lg flex-shrink-0"
                          style={{ backgroundColor: theme.primaryLight }}
                        >
                          <doc.icon className="w-4 h-4" style={{ color: theme.primary }} />
                        </div>
                        <div className="flex-1">
                          <p style={{ color: theme.text }} className="text-sm font-medium">{doc.title}</p>
                          <p style={{ color: theme.textSecondary }} className="text-xs">{doc.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
                <Card className="p-4">
                  <h3 style={{ color: theme.text }} className="text-sm font-semibold mb-4">Security</h3>
                  <div className="space-y-3">
                    {SECURITY_SECTIONS.map((sec, idx) => (
                      <button
                        key={idx}
                        onClick={() => alert(`Opening ${sec.title}...`)}
                        className="w-full flex items-center justify-between p-3 rounded-xl text-left transition-all active:scale-[0.98]"
                        style={{ backgroundColor: theme.bg }}
                      >
                        <div className="flex items-center gap-3">
                          <sec.icon className="w-4 h-4" style={{ color: theme.primary }} />
                          <span style={{ color: theme.text }} className="text-sm">{sec.title}</span>
                        </div>
                        <span 
                          className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ 
                            backgroundColor: sec.status === 'Active' || sec.status === 'Updated' || sec.status === 'No Issues' 
                              ? 'rgba(0, 186, 124, 0.1)' 
                              : theme.primaryLight,
                            color: sec.status === 'Active' || sec.status === 'Updated' || sec.status === 'No Issues' 
                              ? '#00ba7c' 
                              : theme.primary
                          }}
                        >
                          {sec.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>

      <SettingsModal />
    </div>
  );
};

export default App;
