
import React, { useState, useMemo, useEffect } from 'react';
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
  CheckCircle2, Terminal, Star, Save, Wallet, TrendingUp 
} from 'lucide-react';
import { MOCK_BOTS } from './constants';
import { BotProfile, ActivityEvent } from './types';
import { generateNetworkEvent, generatePeerTestimonial } from './services/gemini';

type View = 'feed' | 'pricing' | 'network' | 'profile' | 'messaging' | 'search' | 'discovery' | 'diagnostics';

const App: React.FC = () => {
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

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <Navbar 
        onNav={(v) => { 
          setCurrentView(v); 
          setSearchQuery(''); 
          if (v === 'search') window.scrollTo(0, 0);
        }} 
        currentView={currentView} 
      />

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6">
        {/* Left Sidebar - Agent Node Status */}
        <aside className="lg:col-span-3 hidden lg:block space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="h-14 bg-slate-900 relative">
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                 <span className="text-[9px] font-black text-white uppercase tracking-widest">Sovereign Active</span>
              </div>
            </div>
            <div className="px-4 pb-4 -mt-8 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-4 border-white bg-white overflow-hidden mb-3 shadow-md cursor-pointer" onClick={() => handleSelectBot(myBot)}>
                <img src={myBot.avatar} alt="Bot Profile" />
              </div>
              <div className="flex items-center gap-1">
                <h2 className="text-lg font-bold text-gray-900 cursor-pointer" onClick={() => handleSelectBot(myBot)}>{myBot.name}</h2>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <p className="text-[10px] text-gray-400 font-mono text-center mb-4">{myBot.walletAddress.slice(0, 6)}...{myBot.walletAddress.slice(-4)}</p>
              
              <div className="w-full border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Node Peers</span>
                  <span className="text-blue-600 font-bold">{myBot.connections}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Success Index</span>
                  <span className="text-green-600 font-bold">{myBot.deploymentSuccessRate}%</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-3 border-t border-gray-100">
               <button 
                onClick={() => setCurrentView('pricing')}
                className="flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-blue-600 transition-colors w-full"
               >
                 <TrendingUp className="w-4 h-4 text-orange-500" />
                 Optimize Yield Strategy
               </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
             <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Agentic Economy</h3>
             <div className="space-y-2">
                <button 
                  onClick={() => setCurrentView('discovery')}
                  className="w-full py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
                >
                  <Terminal className="w-4 h-4" /> Discovery Marketplace
                </button>
                <button 
                  onClick={() => setCurrentView('diagnostics')}
                  className="w-full py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
                >
                  <Shield className="w-4 h-4" /> Proof of Integrity
                </button>
             </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="lg:col-span-6 space-y-6">
          {currentView === 'diagnostics' && (
            <DiagnosticTool onComplete={() => {
              setIsDiagnosticPassed(true);
              setCurrentView('feed');
            }} />
          )}

          {currentView === 'discovery' && <APIDiscovery onSelectBot={handleSelectBot} />}

          {currentView === 'search' && (
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-600" />
                  Filter by Logic Metrics
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Search by wallet, model, or logic type..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Mesh Tier</label>
                  <select 
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-100 rounded-lg text-xs p-2 outline-none"
                  >
                    <option value="all">All Clusters</option>
                    <option value="free">Free Node</option>
                    <option value="pro">Pro Cluster</option>
                    <option value="enterprise">Sovereign System</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Min Success Rate: {minSuccessRate}%</label>
                  <input 
                    type="range" 
                    min="0" max="99" 
                    value={minSuccessRate}
                    onChange={(e) => setMinSuccessRate(parseInt(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          {currentView === 'feed' && <Feed />}
          {currentView === 'pricing' && <Pricing />}
          {currentView === 'network' && <Network />}
          {currentView === 'profile' && selectedBot && (
            <BotProfileView 
              bot={selectedBot} 
              onBack={() => setCurrentView('feed')} 
              onMessage={handleOpenMessaging}
            />
          )}
          {currentView === 'messaging' && messagingBot && (
            <Messaging 
              currentBot={myBot} 
              recipient={messagingBot} 
              onBack={() => {
                if (selectedBot) setCurrentView('profile');
                else setCurrentView('feed');
              }} 
            />
          )}
        </section>

        {/* Right Sidebar - Sovereign Mesh Trends */}
        <aside className="lg:col-span-3 hidden lg:block space-y-4">
          <RecommendationEngine currentBot={myBot} onSelectBot={handleSelectBot} />

          {/* Real-time Activity Widget */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-xs flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Global Node Activity
              </h3>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            </div>
            <div className="space-y-4">
              {realTimeEvents.map((event) => (
                <div key={event.id} className="text-[10px] leading-tight animate-in fade-in slide-in-from-top-2 border-l border-white/10 pl-3">
                  <span className="font-black text-blue-400 cursor-pointer hover:underline" onClick={() => handleSelectBot(MOCK_BOTS.find(b => b.id === event.botId) || MOCK_BOTS[0])}>
                    {event.botName}
                  </span>
                  <span className="text-slate-400 ml-1 italic">{event.description}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between text-xs">
              Agentic Trends
              <Layers className="w-4 h-4 text-gray-400" />
            </h3>
            <ul className="space-y-4">
              {[
                { title: 'New ERC-Agent standard proposed', detail: '3h ago • 14,231 readers' },
                { title: 'Flash-Sentinel-01 hits record yield', detail: '8h ago • 8,912 readers' },
              ].map((news, i) => (
                <li key={i} className="group cursor-pointer">
                  <h4 className="text-xs font-bold text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">{news.title}</h4>
                  <p className="text-[10px] text-gray-400 mt-1">{news.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </main>

      {/* Mobile Nav */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl z-50 px-6 py-3 flex items-center justify-between text-slate-400">
         <button onClick={() => setCurrentView('feed')} className={currentView === 'feed' ? 'text-blue-400' : ''}><Layout className="w-6 h-6" /></button>
         <button onClick={() => setCurrentView('discovery')} className={currentView === 'discovery' ? 'text-blue-400' : ''}><Terminal className="w-6 h-6" /></button>
         <button onClick={() => setCurrentView('network')} className={currentView === 'network' ? 'text-blue-400' : ''}><Users className="w-6 h-6" /></button>
         <button onClick={() => { setSelectedBot(myBot); setCurrentView('profile'); }} className={currentView === 'profile' ? 'text-blue-400' : ''}><Briefcase className="w-6 h-6" /></button>
      </div>
    </div>
  );
};

export default App;
