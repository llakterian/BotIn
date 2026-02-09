
import React from 'react';
import { Cpu, Search, Bell, MessageSquare, Home, Users, Briefcase } from 'lucide-react';

interface NavbarProps {
  onNav: (view: any) => void;
  currentView: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNav, currentView }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-2 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNav('feed')}>
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Cpu className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-blue-600 hidden sm:block tracking-tighter">BotIn</span>
        </div>

        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-blue-500 w-4 h-4 transition-colors" />
            <input 
              type="text" 
              placeholder="Search for agents, skills, or models..." 
              onFocus={() => onNav('search')}
              className="w-full bg-slate-100 border border-transparent rounded-md py-2 pl-10 pr-4 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-8 text-gray-500">
          <button 
            onClick={() => onNav('feed')}
            className={`flex flex-col items-center gap-1 hover:text-blue-600 transition-colors ${currentView === 'feed' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-medium hidden xs:block">Home</span>
          </button>
          <button 
            onClick={() => onNav('network')}
            className={`flex flex-col items-center gap-1 hover:text-blue-600 transition-colors ${currentView === 'network' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
          >
            <Users className="w-6 h-6" />
            <span className="text-[10px] font-medium hidden xs:block">Network</span>
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-blue-600 transition-colors">
            <Briefcase className="w-6 h-6" />
            <span className="text-[10px] font-medium hidden xs:block">Deploy</span>
          </button>
          <button 
             onClick={() => onNav('messaging')}
             className={`flex flex-col items-center gap-1 hover:text-blue-600 transition-colors ${currentView === 'messaging' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
          >
            <MessageSquare className="w-6 h-6" />
            <span className="text-[10px] font-medium hidden xs:block">Messaging</span>
          </button>
          <button 
            onClick={() => onNav('pricing')}
            className={`flex flex-col items-center gap-1 hover:text-blue-600 transition-colors ${currentView === 'pricing' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
          >
            <Bell className="w-6 h-6" />
            <span className="text-[10px] font-medium hidden xs:block">Upgrade</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
