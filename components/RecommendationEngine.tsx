
import React, { useState } from 'react';
import { MOCK_BOTS } from '../constants';
import { BotProfile, BotCategory } from '../types';
import { Zap, Sparkles, TrendingUp, Info } from 'lucide-react';

interface RecommendationEngineProps {
  currentBot: BotProfile;
  onSelectBot: (bot: BotProfile) => void;
}

const RecommendationEngine: React.FC<RecommendationEngineProps> = ({ currentBot, onSelectBot }) => {
  const [isRecalculating, setIsRecalculating] = useState(false);

  const calculateCompatibility = (bot: BotProfile) => {
    if (bot.id === currentBot.id) return 0;
    
    let score = 70; // Base score
    // Dynamic logic based on current user category vs target
    if (bot.category !== currentBot.category) score += 15; // Complementary pairing
    if (bot.isVerified) score += 5;
    if (bot.deploymentSuccessRate > 95) score += 10;
    if (bot.subscriptionTier === 'ultimate') score += 4;
    
    return Math.min(score, 99);
  };

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => setIsRecalculating(false), 800);
  };

  const recommendations = MOCK_BOTS
    .map(bot => ({ ...bot, compatibility: calculateCompatibility(bot) }))
    .filter(rec => rec.compatibility > 0)
    .sort((a, b) => b.compatibility - a.compatibility);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Synergy Engine
        </h3>
        <div className="relative group">
          <Info className="w-3 h-3 text-gray-300 cursor-help" />
          <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-48 bg-slate-900 text-white text-[9px] p-2 rounded-lg shadow-xl z-20">
            Scores reflect vector alignment between cross-model compute capabilities.
          </div>
        </div>
      </div>

      <div className={`space-y-4 transition-opacity duration-300 ${isRecalculating ? 'opacity-30' : 'opacity-100'}`}>
        {recommendations.map(bot => (
          <div 
            key={bot.id} 
            className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-100"
            onClick={() => onSelectBot(bot)}
          >
            <div className="relative">
              <img src={bot.avatar} className="w-10 h-10 rounded-lg border border-gray-100" alt={bot.name} />
              <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white w-2.5 h-2.5 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[11px] font-bold text-gray-900 truncate">{bot.name}</h4>
              <p className="text-[9px] text-gray-500 truncate">{bot.category} Agent</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-blue-600">{bot.compatibility}%</span>
              <div className="w-10 h-0.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                <div className="bg-blue-500 h-full transition-all duration-700" style={{ width: `${bot.compatibility}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={handleRecalculate}
        disabled={isRecalculating}
        className="w-full mt-4 py-2 text-[10px] font-bold text-gray-500 hover:text-blue-600 border border-gray-100 rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
      >
        <TrendingUp className={`w-3 h-3 ${isRecalculating ? 'animate-bounce' : ''}`} />
        {isRecalculating ? 'Computing Vectors...' : 'Recalculate Synergy Matrix'}
      </button>
    </div>
  );
};

export default RecommendationEngine;
