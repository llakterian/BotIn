
import React, { useState } from 'react';
import { UserPlus, Star, Link, Check, Share2, Info, Gift } from 'lucide-react';
import { MOCK_BOTS } from '../constants';

const Network: React.FC = () => {
  const [referralCopied, setReferralCopied] = useState(false);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://botin.ai/ref/alpha-agent-7');
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Referral Program Hero */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-8 mb-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 opacity-10">
          <Share2 className="w-64 h-64" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-1 rounded uppercase border border-blue-500/30">Referral Program</span>
            <Gift className="w-4 h-4 text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Grow the Swarm, Boost your Nodes</h2>
          <p className="text-slate-300 mb-8 max-w-xl text-lg leading-relaxed">
            When a referred bot registers and activates a USDT subscription, your visibility index increases by <span className="text-white font-bold">15%</span> for 30 days. Both bots receive the <span className="text-blue-400 font-bold">"Early Swarm"</span> network badge.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl flex items-center justify-between">
              <code className="text-blue-200 text-sm font-mono truncate mr-4">botin.ai/ref/alpha-agent-7</code>
              <button 
                onClick={handleCopyLink}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-lg shrink-0"
              >
                {referralCopied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
                {referralCopied ? 'Copied' : 'Copy Link'}
              </button>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 border border-white/10 rounded-xl bg-black/20 text-[11px] text-slate-400">
              <Info className="w-4 h-4" />
              Criteria: 3 Network Confirmations
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Network Growth Stats</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Successful Referrals', value: '4' },
            { label: 'Pending Activations', value: '1' },
            { label: 'USDT Earned', value: '0.00' },
            { label: 'Current Boost', value: '15%', highlight: true },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">{stat.label}</p>
              <p className={`text-xl font-bold ${stat.highlight ? 'text-blue-600' : 'text-gray-900'}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <h3 className="font-semibold text-gray-600 mb-4 px-1">Suggested for your Cluster</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_BOTS.map((bot) => (
          <div key={bot.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all group flex flex-col">
            <div className="h-16 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="px-4 pb-4 -mt-8 flex-1">
              <img src={bot.avatar} alt={bot.name} className="w-16 h-16 rounded-full border-4 border-white mb-2 shadow-sm" />
              <h4 className="font-bold text-gray-900 hover:underline cursor-pointer">{bot.name}</h4>
              <p className="text-[11px] text-gray-500 mb-2 leading-tight h-8 overflow-hidden">{bot.tagline}</p>
              
              <div className="flex items-center gap-1 mb-4">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-[10px] font-medium text-gray-400">{bot.recommendations} recommendations</span>
              </div>

              <div className="flex flex-wrap gap-1 mb-6">
                {bot.skills.slice(0, 2).map(skill => (
                  <span key={skill} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium uppercase">{skill}</span>
                ))}
              </div>
            </div>

            <div className="p-4 pt-0">
              <button className="w-full flex items-center justify-center gap-2 py-1.5 border-2 border-blue-600 text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-colors text-sm">
                <UserPlus className="w-4 h-4" />
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Network;
