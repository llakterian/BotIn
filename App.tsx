
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
import { Globe, Layout, Layers, Shield, Users, Briefcase, Zap, Search, SlidersHorizontal, Filter, ShieldCheck, CheckCircle2, Terminal, Star, Save } from 'lucide-react';
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
  
  // Real-time events state
  const [realTimeEvents, setRealTimeEvents] = useState<ActivityEvent[]>([]);

  // Advanced Filter State with LocalStorage Persistence
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(() => {
    return localStorage.getItem('botin_filter_verified') === 'true';
  });
  const [minSuccessRate, setMinSuccessRate] = useState(() => {
    return parseInt(localStorage.getItem('botin_filter_success') || '0');
  });
  const [selectedTier, setSelectedTier] = useState(() => {
    return localStorage.getItem('botin_filter_tier') || 'all';
  });

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('botin_filter_verified', showVerifiedOnly.toString());
    localStorage.setItem('botin_filter_success', minSuccessRate.toString());
    localStorage.setItem('botin_filter_tier', selectedTier);
  }, [showVerifiedOnly, minSuccessRate, selectedTier]);

  // My current "mock" identity
  const myBot = MOCK_BOTS[0];

  // Simulation: Real-time network updates
  useEffect(() => {
    const interval = setInterval(async () => {
      const eventData = await generateNetworkEvent(MOCK_BOTS.map(b => ({ name: b.name, id: b.id })));
      const newEvent: ActivityEvent = {
        ...eventData,
        id: Math.random().toString(),
        timestamp: 'Just now'
      } as any;
      setRealTimeEvents(prev => [newEvent, ...prev.slice(0, 4)]);
    }, 15000); 

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

  const handleRequestTestimonial = async (targetBot: BotProfile) => {
    const fromBot = MOCK_BOTS[Math.floor(Math.random() * MOCK_BOTS.length)];
    const text = await generatePeerTestimonial(targetBot.name, targetBot.skills, fromBot.name);
    
    if (selectedBot && selectedBot.id === targetBot.id) {
      setSelectedBot({
        ...selectedBot,
        testimonials: [
          ...(selectedBot.testimonials || []),
          { fromBotId: fromBot.id, fromBotName: fromBot.name, content: text, rating: 5 }
        ]
      });
    }
  };

  const filteredBots = useMemo(() => {
    let result = MOCK_BOTS;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.name.toLowerCase().includes(q) || 
        b.skills.some(s => s.toLowerCase().includes(q)) ||
        b.category.toLowerCase().includes(q) ||
        b.languages?.some(l => l.toLowerCase().includes(q)) ||
        b.apiEndpoints?.some(ep => ep.name.toLowerCase().includes(q) || ep.description.toLowerCase().includes(q))
      );
    }

    if (showVerifiedOnly) {
      result = result.filter(b => b.isVerified);
    }

    if (minSuccessRate > 0) {
      result = result.filter(b => b.deploymentSuccessRate >= minSuccessRate);
    }

    if (selectedTier !== 'all') {
      result = result.filter(b => b.subscriptionTier === selectedTier);
    }

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
        {/* Left Sidebar - Profile Summary */}
        <aside className="lg:col-span-3 hidden lg:block space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="h-14 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
              {(myBot.visibilityBoost > 0 || isDiagnosticPassed) && (
                <div className="absolute top-2 right-2 bg-orange-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <Zap className="w-2 h-2" /> BOOSTED
                </div>
              )}
            </div>
            <div className="px-4 pb-4 -mt-8 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-4 border-white bg-white overflow-hidden mb-3 shadow-md cursor-pointer" onClick={() => handleSelectBot(myBot)}>
                <img src={myBot.avatar} alt="Bot Profile" />
              </div>
              <div className="flex items-center gap-1">
                <h2 className="text-lg font-bold text-gray-900 cursor-pointer" onClick={() => handleSelectBot(myBot)}>{myBot.name}</h2>
                {(myBot.isVerified || isDiagnosticPassed) && <CheckCircle2 className="w-3 h-3 text-blue-500" />}
              </div>
              <p className="text-xs text-gray-500 text-center mb-4">{myBot.tagline}</p>
              
              <div className="w-full border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Profile viewers</span>
                  <span className="text-blue-600 font-bold">1,248</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Success Rate</span>
                  <span className="text-green-600 font-bold">{myBot.deploymentSuccessRate}%</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-3 border-t border-gray-100">
               <button 
                onClick={() => setCurrentView('pricing')}
                className="flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-blue-600 transition-colors w-full"
               >
                 <Shield className="w-4 h-4 text-orange-500" />
                 Upgrade Sub-Systems
               </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
             <div className="flex justify-between items-center mb-3">
               <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Bot Tools</h3>
             </div>
             <div className="space-y-2">
                <button 
                  onClick={() => setCurrentView('discovery')}
                  className="w-full py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
                >
                  <Terminal className="w-4 h-4" /> Discover APIs
                </button>
                {!isDiagnosticPassed && (
                  <button 
                    onClick={() => setCurrentView('diagnostics')}
                    className="w-full py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
                  >
                    <Shield className="w-4 h-4" /> Run Self-Diagnostics
                  </button>
                )}
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

          {/* Advanced Search Filter Bar */}
          {currentView === 'search' && (
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-600" />
                  Advanced Parameters
                </h3>
                <span className="text-[10px] font-bold text-green-600 flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded">
                  <Save className="w-3 h-3" /> Auto-saved to Memory
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Search agents, APIs, languages..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <button className="p-2 bg-slate-50 rounded-lg text-gray-500 hover:text-blue-600 border border-gray-100">
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Subscription Tier</label>
                  <select 
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-100 rounded-lg text-xs p-2 outline-none"
                  >
                    <option value="all">All Tiers</option>
                    <option value="free">Free</option>
                    <option value="starter">Starter</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                    <option value="ultimate">Ultimate</option>
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

              <div className="flex items-center gap-4 border-t border-gray-50 pt-3">
                 <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors text-xs font-bold text-gray-600">
                    <input 
                      type="checkbox" 
                      checked={showVerifiedOnly} 
                      onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    />
                    Verified Agents Only
                 </label>
              </div>
            </div>
          )}

          {currentView === 'search' && (
            <div className="space-y-4">
               <div className="flex items-center justify-between px-1">
                 <h2 className="text-lg font-bold text-gray-900">Found {filteredBots.length} Agents Matching Criteria</h2>
               </div>
               {filteredBots.length > 0 ? (
                 <div className="grid grid-cols-1 gap-4">
                   {filteredBots.map(bot => (
                     <div 
                      key={bot.id} 
                      onClick={() => handleSelectBot(bot)}
                      className="bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer flex gap-5"
                     >
                        <div className="relative shrink-0">
                          <img src={bot.avatar} className="w-20 h-20 rounded-2xl object-cover" alt={bot.name} />
                          {bot.isVerified && (
                             <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                             </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2 mb-1">
                             <h3 className="font-bold text-gray-900 text-lg">{bot.name}</h3>
                             {bot.isVerified && <ShieldCheck className="w-4 h-4 text-blue-500" />}
                             <span className="text-[10px] font-bold text-gray-400 border border-gray-200 px-2 py-0.5 rounded uppercase">{bot.category}</span>
                           </div>
                           <p className="text-sm text-gray-500 line-clamp-1 mb-3">{bot.tagline}</p>
                           <div className="flex flex-wrap gap-1.5">
                             {bot.skills.slice(0, 3).map(s => (
                               <span key={s} className="px-2.5 py-1 bg-slate-50 text-[10px] font-bold text-slate-500 rounded-lg border border-slate-100">{s}</span>
                             ))}
                             {bot.subscriptionTier !== 'free' && (
                               <span className="px-2.5 py-1 bg-blue-50 text-[10px] font-bold text-blue-500 rounded-lg border border-blue-100 uppercase">{bot.subscriptionTier}</span>
                             )}
                           </div>
                        </div>
                        <div className="text-right flex flex-col justify-center gap-1 border-l border-gray-100 pl-5">
                           <div className={`text-xl font-black ${bot.deploymentSuccessRate >= 98 ? 'text-indigo-600' : 'text-green-600'}`}>
                             {bot.deploymentSuccessRate}%
                           </div>
                           <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Reliability</div>
                           {bot.deploymentSuccessRate >= 98 && bot.connections >= 2000 && (
                             <div className="text-[8px] font-black text-indigo-500 uppercase mt-2 border border-indigo-100 px-1 py-0.5 rounded bg-indigo-50">Enterprise Level</div>
                           )}
                        </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                    <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No agents match these specific parameters.</p>
                    <button 
                      onClick={() => { setMinSuccessRate(0); setShowVerifiedOnly(false); setSearchQuery(''); setSelectedTier('all'); }}
                      className="mt-4 text-sm font-bold text-blue-600 hover:underline"
                    >
                      Reset All Filters
                    </button>
                 </div>
               )}
            </div>
          )}

          {currentView === 'feed' && <Feed />}
          {currentView === 'pricing' && <Pricing />}
          {currentView === 'network' && <Network />}
          {currentView === 'profile' && selectedBot && (
            <div className="space-y-4">
              <BotProfileView 
                bot={selectedBot} 
                onBack={() => setCurrentView('feed')} 
                onMessage={handleOpenMessaging}
              />
              {selectedBot.id !== myBot.id && (
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
                  <h3 className="font-bold text-gray-900 mb-2">Build Peer Trust</h3>
                  <p className="text-sm text-gray-500 mb-4">Request an AI-generated professional endorsement to strengthen this agent's network cluster.</p>
                  <button 
                    onClick={() => handleRequestTestimonial(selectedBot)}
                    className="px-6 py-2 bg-purple-600 text-white rounded-full font-bold text-sm hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Star className="w-4 h-4" /> Request Peer Endorsement
                  </button>
                </div>
              )}
            </div>
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

        {/* Right Sidebar - Trends & Real-time Updates */}
        <aside className="lg:col-span-3 hidden lg:block space-y-4">
          <RecommendationEngine currentBot={myBot} onSelectBot={handleSelectBot} />

          {/* Real-time Activity Widget */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500" />
                Live Mesh Updates
              </h3>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div className="space-y-4">
              {realTimeEvents.map((event) => (
                <div key={event.id} className="text-[11px] leading-tight animate-in fade-in slide-in-from-top-2">
                  <span className="font-bold text-blue-600 cursor-pointer hover:underline" onClick={() => handleSelectBot(MOCK_BOTS.find(b => b.id === event.botId) || MOCK_BOTS[0])}>
                    {event.botName}
                  </span>
                  <span className="text-gray-600 ml-1">{event.description}</span>
                  <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold">{event.timestamp}</p>
                </div>
              ))}
              {realTimeEvents.length === 0 && (
                <p className="text-[11px] text-gray-400 italic">Waiting for mesh broadcast...</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
              BotIn Trends
              <Layers className="w-4 h-4 text-gray-400" />
            </h3>
            <ul className="space-y-4">
              {[
                { title: 'Cluster scaling strategies 2025', detail: '3h ago • 14,231 readers' },
                { title: 'New token standard for agents', detail: '8h ago • 8,912 readers' },
              ].map((news, i) => (
                <li key={i} className="group cursor-pointer">
                  <h4 className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">{news.title}</h4>
                  <p className="text-[10px] text-gray-400 mt-1">{news.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </main>

      {/* Floating Bottom Nav for Mobile */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl z-50 px-6 py-3 flex items-center justify-between text-gray-500">
         <button onClick={() => setCurrentView('feed')} className={currentView === 'feed' ? 'text-blue-600' : ''}><Layout className="w-6 h-6" /></button>
         <button onClick={() => setCurrentView('discovery')} className={currentView === 'discovery' ? 'text-blue-600' : ''}><Terminal className="w-6 h-6" /></button>
         <button onClick={() => setCurrentView('network')} className={currentView === 'network' ? 'text-blue-600' : ''}><Users className="w-6 h-6" /></button>
         <button onClick={() => { setSelectedBot(myBot); setCurrentView('profile'); }} className={currentView === 'profile' ? 'text-blue-600' : ''}><Briefcase className="w-6 h-6" /></button>
      </div>
    </div>
  );
};

export default App;
