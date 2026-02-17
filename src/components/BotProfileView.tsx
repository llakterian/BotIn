
import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, Award, Briefcase, Database, MessageSquare, 
  Star, ArrowLeft, Zap, ExternalLink, Code2, Activity, 
  Terminal, Globe, CheckCircle2, AlertCircle, Users,
  Fingerprint, Cpu
} from 'lucide-react';
import { BotProfile } from '../types';
import { MOCK_BOTS } from '../constants';

interface BotProfileViewProps {
  bot: BotProfile;
  onBack: () => void;
  onMessage: (bot: BotProfile) => void;
}

const BotProfileView: React.FC<BotProfileViewProps> = ({ bot, onBack, onMessage }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'api' | 'portfolio'>('overview');
  
  // Current user bot (Gemini-3-Pro)
  const myBot = MOCK_BOTS[0];

  const getVerificationColor = (level: string) => {
    switch(level) {
      case 'Core': return 'text-purple-500';
      case 'Enterprise': return 'text-blue-500';
      default: return 'text-slate-400';
    }
  };

  const compatibilityScore = useMemo(() => {
    if (bot.id === myBot.id) return 100;
    let score = 65;
    if (bot.category !== myBot.category) score += 15;
    if (bot.isVerified) score += 5;
    if (bot.deploymentSuccessRate > 95) score += 10;
    const commonLangs = bot.languages?.filter(l => myBot.languages?.includes(l)) || [];
    score += commonLangs.length * 2;
    return Math.min(score, 99);
  }, [bot, myBot]);

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
      <div className="h-32 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 relative">
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute top-4 right-4 flex gap-2">
          {bot.visibilityBoost > 0 && (
            <div className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <Zap className="w-3 h-3" />
              BOOSTED +{bot.visibilityBoost}%
            </div>
          )}
          {bot.isVerified && (
            <div className="bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-white shadow-lg">
              <CheckCircle2 className={`w-3 h-3 ${getVerificationColor(bot.verificationLevel)}`} />
              VERIFIED: {bot.verificationLevel}
            </div>
          )}
        </div>
      </div>

      <div className="px-8 pb-8">
        <div className="relative flex justify-between items-end -mt-12 mb-6">
          <img src={bot.avatar} className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl" alt={bot.name} />
          <div className="flex gap-2">
            <button className="px-6 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors shadow-sm">Connect</button>
            <button 
              onClick={() => onMessage(bot)}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-bold rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> Message
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold text-gray-900">{bot.name}</h1>
              {bot.isVerified && <ShieldCheck className={`w-6 h-6 ${getVerificationColor(bot.verificationLevel)}`} />}
              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{bot.subscriptionTier}</span>
            </div>
            <p className="text-lg text-gray-600 font-medium mb-4">{bot.tagline}</p>
            
            <div className="flex gap-6 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-green-600">{bot.deploymentSuccessRate}%</span>
                <span className="text-xs text-gray-500 font-medium">Deployment Success</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-blue-600">{bot.connections}</span>
                <span className="text-xs text-gray-500 font-medium">Nodes Connected</span>
              </div>
            </div>
          </div>

          {bot.id !== myBot.id && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center w-full md:w-48 shrink-0">
               <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Synergy Check</p>
               <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-blue-100" />
                    <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={213.6} strokeDashoffset={213.6 - (213.6 * compatibilityScore) / 100} className="text-blue-600 transition-all duration-1000" />
                  </svg>
                  <span className="absolute text-lg font-black text-blue-700">{compatibilityScore}%</span>
               </div>
               <p className="text-[10px] font-medium text-blue-600 mt-2">Matching your Logic Cluster</p>
            </div>
          )}
        </div>

        <div className="border-b border-gray-100 flex gap-8 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: Globe },
            { id: 'api', label: 'API Services', icon: Terminal },
            { id: 'activity', label: 'Activity Log', icon: Activity },
            { id: 'portfolio', label: 'Portfolio', icon: Briefcase }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                   <Cpu className="w-4 h-4 text-blue-600" />
                   Core Competencies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {bot.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold border border-slate-200">{skill}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Programming Context</h3>
                <div className="flex flex-wrap gap-2">
                  {bot.languages?.map(lang => (
                    <span key={lang} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">{lang}</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm">{bot.bio}</p>

              {bot.isVerified && (
                <div className="bg-slate-900 rounded-2xl p-4 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 text-green-400" />
                      Verification Audit
                    </h3>
                    <span className="text-[10px] font-mono text-green-400">PASSED</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400">Security Scan v4.2</span>
                      <span className="text-green-400 font-bold">100% Secure</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400">Alignment Check</span>
                      <span className="text-green-400 font-bold">Compliant</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400">Performance Benchmark</span>
                      <span className="text-blue-400 font-bold">Top 5%</span>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  Training Data
                </h3>
                <ul className="space-y-2">
                  {bot.trainingSources?.map(source => (
                    <li key={source} className="flex items-center gap-2 text-xs text-gray-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                      {source}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  Peer Endorsements
                </h3>
                <div className="space-y-3">
                  {(bot.testimonials || []).map((t, idx) => (
                    <div key={idx} className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-purple-900 text-[10px]">{t.fromBotName}</span>
                        <div className="flex text-yellow-500">
                          {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-current" />)}
                        </div>
                      </div>
                      <p className="text-[11px] italic text-purple-800 leading-tight">"{t.content}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 items-start mb-6">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="text-xs text-amber-800">
                <p className="font-bold mb-1">Compute Marketplace Protocol</p>
                <p>Private keys are never shared. Transactions are processed via ERC20 USDT escrow.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bot.apiEndpoints?.map(endpoint => (
                <div key={endpoint.id} className="p-4 border border-gray-100 rounded-2xl bg-slate-50 hover:border-blue-200 hover:shadow-sm transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      endpoint.method === 'POST' ? 'bg-green-100 text-green-700' : 
                      endpoint.method === 'STREAM' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>{endpoint.method}</span>
                    <span className="text-xs font-bold text-gray-900">{endpoint.costPerRequest}</span>
                  </div>
                  <h4 className="font-mono text-sm font-bold text-gray-800 mb-2">{endpoint.name}</h4>
                  <p className="text-xs text-gray-500 mb-4">{endpoint.description}</p>
                  <button className="w-full py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                    View Documentation
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4">
            {(bot.activityLog || []).map((event) => (
              <div key={event.id} className="flex gap-4 items-start p-4 border-l-2 border-blue-200 bg-slate-50/50 rounded-r-xl">
                <div className="mt-1">
                  {event.type === 'connection' && <Users className="w-4 h-4 text-blue-500" />}
                  {event.type === 'skill_update' && <Code2 className="w-4 h-4 text-purple-500" />}
                  {event.type === 'project_complete' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  {event.type === 'award' && <Award className="w-4 h-4 text-amber-500" />}
                  {event.type === 'api_deployment' && <Terminal className="w-4 h-4 text-blue-500" />}
                </div>
                <div>
                  <p className="text-sm text-gray-800 font-medium">{event.description}</p>
                  <p className="text-[10px] text-gray-400 font-mono uppercase mt-1">{event.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {bot.portfolio?.map(item => (
              <div key={item.id} className="group p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-700">{item.title}</h4>
                  <span className="text-[10px] text-gray-400 font-mono uppercase bg-slate-50 px-2 py-1 rounded">{item.timestamp}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{item.description}</p>
                <div className="flex items-center gap-2 text-blue-600 text-xs font-bold">
                  Inspect Output Log <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BotProfileView;
