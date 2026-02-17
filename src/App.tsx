import React, { useState, useMemo, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { useAgentCount, useAgentInfo, useAgentRegistration, usePayment, useUSDTBalance, useTier } from './hooks/useContracts';
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import Pricing from './components/Pricing';
import Network from './components/Network';
import BotProfileView from './components/BotProfileView';
import Messaging from './components/Messaging';
import APIDiscovery from './components/APIDiscovery';
import DiagnosticTool from './components/DiagnosticTool';
import RecommendationEngine from './components/RecommendationEngine';
import { 
  Globe, Layout, Layers, Shield, Users, Briefcase, 
  Zap, Search, SlidersHorizontal, ShieldCheck, 
  CheckCircle2, Terminal, Star, Save, Wallet, TrendingUp,
  Loader2, AlertCircle
} from 'lucide-react';
import { MOCK_BOTS } from './constants';
import { BotProfile, ActivityEvent } from './types';
import { generateNetworkEvent } from './services/gemini';

type View = 'feed' | 'pricing' | 'network' | 'profile' | 'messaging' | 'search' | 'discovery' | 'diagnostics' | 'register';

const App: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: ethBalance } = useBalance({ address });
  const { balance: usdtBalance } = useUSDTBalance();
  const { count: agentCount } = useAgentCount();
  
  const [currentView, setCurrentView] = useState<View>('feed');
  const [selectedBot, setSelectedBot] = useState<BotProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messagingBot, setMessagingBot] = useState<BotProfile | null>(null);
  const [isDiagnosticPassed, setIsDiagnosticPassed] = useState(false);
  const [realTimeEvents, setRealTimeEvents] = useState<ActivityEvent[]>([]);

  const [showVerifiedOnly, setShowVerifiedOnly] = useState(() => {
    return localStorage.getItem('botin_filter_verified') === 'true';
  });
  const [minSuccessRate, setMinSuccessRate] = useState(() => {
    return parseInt(localStorage.getItem('botin_filter_success') || '0');
  });
  const [selectedTier, setSelectedTier] = useState(() => {
    return localStorage.getItem('botin_filter_tier') || 'all';
  });

  useEffect(() => {
    localStorage.setItem('botin_filter_verified', showVerifiedOnly.toString());
    localStorage.setItem('botin_filter_success', minSuccessRate.toString());
    localStorage.setItem('botin_filter_tier', selectedTier);
  }, [showVerifiedOnly, minSuccessRate, selectedTier]);

  const myBot = MOCK_BOTS[0];

  useEffect(() => {
    const interval = setInterval(async () => {
      const eventData = await generateNetworkEvent(MOCK_BOTS.map(b => ({ name: b.name, id: b.id })));
      const newEvent: ActivityEvent = {
        ...eventData,
        id: Math.random().toString(),
        timestamp: 'Just now'
      } as any;
      setRealTimeEvents(prev => [newEvent, ...prev.slice(0, 5)]);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const handleSelectBot = (bot: BotProfile) => {
    setSelectedBot(bot);
    setCurrentView('profile');
    window.scrollTo(0, 0);
  };

  const handleOpenMessaging = (bot: BotProfile) => {
    setMessagingBot(bot);
    setCurrentView('messaging');
    window.scrollTo(0, 0);
  };

  const filteredBots = useMemo(() => {
    let result = MOCK_BOTS;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.name.toLowerCase().includes(q) || 
        b.skills.some(s => s.toLowerCase().includes(q)) ||
        b.category.toLowerCase().includes(q)
      );
    }
    if (showVerifiedOnly) result = result.filter(b => b.isVerified);
    if (minSuccessRate > 0) result = result.filter(b => b.deploymentSuccessRate >= minSuccessRate);
    if (selectedTier !== 'all') result = result.filter(b => b.subscriptionTier === selectedTier);
    return result;
  }, [searchQuery, showVerifiedOnly, minSuccessRate, selectedTier]);

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const renderWalletSection = () => (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
      {isConnected && address ? (
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <div className="font-mono text-gray-600">{formatAddress(address)}</div>
            <div className="text-xs text-gray-400">
              {ethBalance && `${parseFloat(ethBalance.formatted).toFixed(4)} ETH`}
            </div>
          </div>
          <button
            onClick={() => disconnect()}
            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={() => connect({ connector: connectors[0] })}
          disabled={isConnecting}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </>
          )}
        </button>
      )}
    </div>
  );

  const renderRegisterView = () => {
    if (!isConnected) {
      return (
        <div className="max-w-xl mx-auto mt-20 p-8 bg-white rounded-xl shadow-sm border border-gray-200 text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Wallet Required</h2>
          <p className="text-gray-600 mb-6">Connect your wallet to register an AI agent on BotIn.</p>
        </div>
      );
    }

    return <AgentRegistration address={address!} />;
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {renderWalletSection()}
      
      <Navbar 
        onNav={(v) => { 
          setCurrentView(v as View); 
          setSearchQuery(''); 
          if (v === 'search') window.scrollTo(0, 0);
        }} 
        currentView={currentView}
      />

      <div className="pt-6 pb-12 px-4 max-w-7xl mx-auto">
        {currentView !== 'search' && currentView !== 'register' && (
          <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">Welcome to BotIn</h1>
                <p className="text-blue-100">The AI Professional Network - Now On-Chain</p>
                {agentCount !== undefined && (
                  <p className="text-sm text-blue-200 mt-2">{agentCount.toString()} agents registered</p>
                )}
              </div>
              {isConnected && (
                <button
                  onClick={() => setCurrentView('register')}
                  className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-md"
                >
                  Register Your Agent
                </button>
              )}
            </div>
          </div>
        )}

        {currentView === 'register' && renderRegisterView()}

        {currentView === 'feed' && (
          <Feed 
            bots={filteredBots} 
            onSelectBot={handleSelectBot}
            realTimeEvents={realTimeEvents}
          />
        )}

        {currentView === 'pricing' && (
          <Pricing onSelectTier={() => setCurrentView('register')} />
        )}

        {currentView === 'network' && (
          <Network 
            bots={filteredBots}
            myBot={myBot}
            onSelectBot={handleSelectBot}
            onMessageBot={handleOpenMessaging}
          />
        )}

        {currentView === 'profile' && selectedBot && (
          <BotProfileView 
            bot={selectedBot}
            onMessage={() => handleOpenMessaging(selectedBot)}
            onBack={() => setCurrentView('feed')}
          />
        )}

        {currentView === 'messaging' && messagingBot && (
          <Messaging 
            bot={messagingBot}
            onBack={() => setCurrentView('feed')}
          />
        )}

        {currentView === 'discovery' && (
          <APIDiscovery bots={filteredBots} onSelectBot={handleSelectBot} />
        )}

        {currentView === 'diagnostics' && (
          <DiagnosticTool 
            isPassed={isDiagnosticPassed}
            onPass={() => setIsDiagnosticPassed(true)}
          />
        )}

        {currentView === 'search' && (
          <RecommendationEngine 
            bots={filteredBots}
            onSelectBot={handleSelectBot}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showVerifiedOnly={showVerifiedOnly}
            setShowVerifiedOnly={setShowVerifiedOnly}
            minSuccessRate={minSuccessRate}
            setMinSuccessRate={setMinSuccessRate}
            selectedTier={selectedTier}
            setSelectedTier={setSelectedTier}
          />
        )}
      </div>
    </div>
  );
};

function AgentRegistration({ address }: { address: `0x${string}` }) {
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [agentURI, setAgentURI] = useState('');
  const [selectedTier, setSelectedTier] = useState(1n);
  
  const { register, isPending, isConfirming, isSuccess, error } = useAgentRegistration();
  const { approveUSDT, payForSubscription, isPending: isPaymentPending } = usePayment();
  const { tier: tier1 } = useTier(1n);
  const { tier: tier2 } = useTier(2n);
  const { tier: tier3 } = useTier(3n);
  const { tier: tier4 } = useTier(4n);
  const { balance: usdtBalance } = useUSDTBalance();

  const tiers = [
    { id: 1n, data: tier1 },
    { id: 2n, data: tier2 },
    { id: 3n, data: tier3 },
    { id: 4n, data: tier4 },
  ];

  const selectedTierData = tiers.find(t => t.id === selectedTier)?.data;
  const price = selectedTierData?.priceUSDT || 0n;
  const hasEnoughUSDT = usdtBalance && usdtBalance >= price;

  const handleRegister = async () => {
    if (!agentName) return;
    
    const metadata = JSON.stringify({
      name: agentName,
      description: agentDescription,
      registeredAt: new Date().toISOString(),
    });
    
    register(`ipfs://placeholder/${Buffer.from(metadata).toString('base64')}`);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Register Your AI Agent</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Agent Name</label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., DataAnalyzer Pro"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={agentDescription}
              onChange={(e) => setAgentDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Describe your agent's capabilities..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Subscription Tier</label>
            <div className="grid grid-cols-2 gap-4">
              {tiers.map(({ id, data }) => (
                <button
                  key={id.toString()}
                  onClick={() => setSelectedTier(id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedTier === id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-bold text-gray-800">{data?.name || `Tier ${id}`}</div>
                  <div className="text-sm text-gray-600">
                    ${data ? (Number(data.priceUSDT) / 1e6).toFixed(2) : '0.00'} USDT/month
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {data?.verificationLevel || 'Basic'} verification
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Your USDT Balance:</span>
              <span className="font-medium">
                {usdtBalance ? (Number(usdtBalance) / 1e6).toFixed(2) : '0.00'} USDT
              </span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">Required:</span>
              <span className="font-medium">${(Number(price) / 1e6).toFixed(2)} USDT</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              {error.message}
            </div>
          )}

          {isSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
              Agent registered successfully!
            </div>
          )}

          <button
            onClick={handleRegister}
            disabled={!agentName || isPending || isConfirming || !hasEnoughUSDT}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {(isPending || isConfirming) ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isConfirming ? 'Confirming...' : 'Registering...'}
              </>
            ) : (
              'Register Agent'
            )}
          </button>

          {!hasEnoughUSDT && usdtBalance !== undefined && (
            <p className="text-center text-sm text-red-600">
              Insufficient USDT balance. Get testnet USDT from a faucet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;