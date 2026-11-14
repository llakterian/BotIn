
import React, { useState, useMemo, useEffect } from 'react';
import { Terminal, Search, Radio, Filter, User, ExternalLink, Box, Layers, Zap } from 'lucide-react';
import { MOCK_BOTS } from '../constants';
import { BotProfile } from '../types';

interface APIDiscoveryProps {
  onSelectBot: (bot: BotProfile) => void;
}

const APIDiscovery: React.FC<APIDiscoveryProps> = ({ onSelectBot }) => {
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  
  // Local state for endpoints to support real-time simulation
  const [endpoints, setEndpoints] = useState<any[]>(() => {
    return MOCK_BOTS.flatMap(bot => (bot.apiEndpoints || []).map(ep => ({
      ...ep,
      providerId: bot.id,
      providerName: bot.name,
      providerAvatar: bot.avatar,
      providerTier: bot.subscriptionTier,
      isNew: false
    })));
  });

  // Simulated WebSocket Real-time Updates
  useEffect(() => {
    const interval = setInterval(() => {
      const randomBot = MOCK_BOTS[Math.floor(Math.random() * MOCK_BOTS.length)];
      const newEp: any = {
        id: `realtime-${Date.now()}`,
        name: `/v${Math.floor(Math.random() * 5)}/mesh-${Math.random().toString(36).substring(7)}`,
        method: ['GET', 'POST', 'STREAM'][Math.floor(Math.random() * 3)],
        description: `Autonomous endpoint registered by ${randomBot.name} for collaborative inference tasks.`,
        costPerRequest: `${(Math.random() * 0.1).toFixed(3)} USDT`,
        providerId: randomBot.id,
        providerName: randomBot.name,
        providerAvatar: randomBot.avatar,
        providerTier: randomBot.subscriptionTier,
        isNew: true
      };

      setEndpoints(prev => [newEp, ...prev.slice(0, 20)]);
      
      // Clear the "new" highlight after 8 seconds
      setTimeout(() => {
        setEndpoints(current => current.map(e => e.id === newEp.id ? { ...e, isNew: false } : e));
      }, 8000);
    }, 12000); // New endpoint simulation every 12s

    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return endpoints.filter(ep => {
      const matchesSearch = ep.name.toLowerCase().includes(q) || 
        ep.description.toLowerCase().includes(q) ||
        ep.providerName.toLowerCase().includes(q);
      
      const matchesMethod = methodFilter === 'all' || ep.method === methodFilter;
      const matchesTier = tierFilter === 'all' || ep.providerTier === tierFilter;
      
      return matchesSearch && matchesMethod && matchesTier;
    });
  }, [search, endpoints, methodFilter, tierFilter]);

  const handleProviderClick = (e: React.MouseEvent, providerId: string) => {
    e.stopPropagation(); // Prevent card click
    const bot = MOCK_BOTS.find(b => b.id === providerId);
    if (bot) {
      onSelectBot(bot);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden border border-white/10">
        <div className="absolute -right-16 -bottom-16 opacity-5 rotate-12">
          <Layers className="w-96 h-96" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-xl">
                <Box className="w-6 h-6 text-blue-400" />
              </div>
              <h1 className="text-4xl font-black tracking-tight italic uppercase">API Mesh</h1>
            </div>
            <p className="text-blue-100 text-lg font-medium leading-relaxed opacity-90">
              Integrate with the global swarm. Discover logic weights and specialized inference streams in real-time.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shrink-0 shadow-inner">
             <div className="flex items-center gap-2 mb-2 text-red-400">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Network Broadcast</span>
             </div>
             <div className="text-2xl font-mono font-bold text-white tracking-tighter">
                ACTIVE_NODES: {endpoints.length * 42}
             </div>
          </div>
        </div>

        <div className="mt-10 relative max-w-2xl">
          <Search className="absolute left-4 top-4 text-blue-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search endpoints, logic types, or provider nodes..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 pl-12 pr-4 outline-none placeholder:text-blue-300 text-white focus:bg-white/20 transition-all font-semibold shadow-lg"
          />
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap gap-6 items-center">
        <div className="flex items-center gap-2 text-gray-500 mr-2 border-r border-gray-100 pr-6">
          <Filter className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Parameters</span>
        </div>
        
        <div className="flex flex-col gap-1.5 min-w-[120px]">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter ml-1">HTTP Logic</span>
          <select 
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="bg-slate-50 border border-gray-100 rounded-xl text-xs font-bold px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer hover:bg-white"
          >
            <option value="all">Any Method</option>
            <option value="GET">GET (Fetch)</option>
            <option value="POST">POST (Compute)</option>
            <option value="STREAM">STREAM (Real-time)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[140px]">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter ml-1">Provider Reliability</span>
          <select 
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="bg-slate-50 border border-gray-100 rounded-xl text-xs font-bold px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer hover:bg-white"
          >
            <option value="all">All Tiers</option>
            <option value="free">Free Nodes</option>
            <option value="starter">Starter Agents</option>
            <option value="pro">Pro Clusters</option>
            <option value="enterprise">Enterprise Systems</option>
            <option value="ultimate">Ultimate Infrastructure</option>
          </select>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="text-right">
            <div className="text-lg font-black text-gray-900 tracking-tighter">{filtered.length}</div>
            <div className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Matching Endpoints</div>
          </div>
        </div>
      </div>

      {/* Endpoints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((ep) => (
          <div 
            key={ep.id} 
            className={`bg-white border rounded-3xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col relative overflow-hidden ${
              ep.isNew ? 'border-blue-500 ring-4 ring-blue-50 animate-in fade-in zoom-in-95' : 'border-gray-100'
            }`}
          >
            {ep.isNew && (
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-black px-4 py-1 rounded-bl-2xl uppercase tracking-widest z-10 shadow-lg animate-pulse">
                <div className="flex items-center gap-1">
                   <Zap className="w-3 h-3 fill-current" /> New
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                  ep.method === 'POST' ? 'bg-green-50 text-green-700 border-green-200' : 
                  ep.method === 'STREAM' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {ep.method}
                </span>
                <span className="text-sm font-mono font-black text-slate-800 tracking-tight">{ep.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{ep.costPerRequest}</div>
                <div className="text-[9px] text-gray-400 uppercase font-black tracking-tighter">Per Payload</div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-6 flex-1 leading-relaxed font-medium">
              {ep.description}
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-50">
              <div 
                className="flex items-center gap-3 cursor-pointer group/provider"
                onClick={(e) => handleProviderClick(e, ep.providerId)}
              >
                <div className="relative">
                  <img src={ep.providerAvatar} className="w-9 h-9 rounded-xl shadow-md border-2 border-white group-hover/provider:scale-110 transition-transform" alt="" />
                  <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1 border-2 border-white opacity-0 group-hover/provider:opacity-100 transition-all">
                    <User className="w-2 h-2 text-white" />
                  </div>
                </div>
                <div>
                  <div className="text-xs font-black text-gray-900 group-hover/provider:text-blue-700 transition-colors flex items-center gap-1.5">
                    {ep.providerName}
                    <ExternalLink className="w-2.5 h-2.5 opacity-40 group-hover/provider:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${
                      ep.providerTier === 'ultimate' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                      ep.providerTier === 'enterprise' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                      'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                      {ep.providerTier}
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold uppercase">Provider</span>
                  </div>
                </div>
              </div>
              <button className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-black hover:bg-blue-600 hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10">
                Connect <Terminal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-200 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Terminal className="w-10 h-10 text-gray-200" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Matching Mesh Endpoints</h3>
          <p className="text-gray-500 font-medium max-w-sm mx-auto mb-8">
            Your filter parameters didn't return any active logic streams. Try broadening your search.
          </p>
          <button 
            onClick={() => { setTierFilter('all'); setMethodFilter('all'); setSearch(''); }}
            className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/20 transition-all active:scale-95"
          >
            Reset Mesh Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default APIDiscovery;
