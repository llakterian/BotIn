import React from 'react';
import { 
  Cpu, 
  Search, 
  Bell, 
  MessageSquare, 
  Zap,
  Wallet,
  Sun,
  Moon
} from 'lucide-react';
import { useThemeStore, colors } from '../store/useThemeStore';

interface NavbarProps {
  onNav: (view: any) => void;
  currentView: string;
  unreadMessages?: number;
  subscriptionTier?: string;
  isConnected?: boolean;
  onConnect?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onNav, 
  currentView, 
  unreadMessages = 0, 
  subscriptionTier = 'Starter',
  isConnected = false,
  onConnect
}) => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const theme = isDarkMode ? colors.dark : colors.light;

  return (
    <nav 
      className="sticky top-0 z-50 px-4 py-3 transition-colors duration-300"
      style={{ 
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${theme.border}`
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={() => onNav('feed')}
          className="flex items-center gap-3 transition-transform active:scale-95"
        >
          <div 
            className="p-2 rounded-xl transition-all hover:opacity-80"
            style={{ backgroundColor: theme.primary }}
          >
            <Cpu className="text-white w-6 h-6" />
          </div>
          <div className="hidden sm:block">
            <span 
              className="text-2xl font-bold tracking-tight"
              style={{ color: theme.text }}
            >
              BotIn
            </span>
          </div>
        </button>

        {/* Global Search */}
        <div className="flex-1 max-w-xl mx-8 hidden md:block">
          <div className="relative">
            <Search 
              className="absolute left-4 top-3 w-4 h-4 transition-colors" 
              style={{ color: theme.textSecondary }}
            />
            <input 
              type="text" 
              placeholder="Search AI agents, APIs, skills..." 
              onFocus={() => onNav('search')}
              className="w-full rounded-full py-2.5 pl-11 pr-4 transition-all outline-none text-sm"
              style={{ 
                backgroundColor: theme.bgSecondary,
                border: 'none',
                color: theme.text
              }}
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full transition-all active:scale-95"
            style={{ 
              color: theme.textSecondary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.primaryLight;
              e.currentTarget.style.color = theme.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = theme.textSecondary;
            }}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Subscription Badge */}
          <div 
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ 
              backgroundColor: tierColors[subscriptionTier]?.bg || theme.bgSecondary,
              color: tierColors[subscriptionTier]?.color || theme.textSecondary,
              border: `1px solid ${tierColors[subscriptionTier]?.border || theme.border}`
            }}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{subscriptionTier}</span>
          </div>

          {/* Notification Bell */}
          <button 
            onClick={() => onNav('pricing')}
            className="relative p-2.5 rounded-full transition-all active:scale-95"
            style={{ color: theme.textSecondary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.primaryLight;
              e.currentTarget.style.color = theme.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = theme.textSecondary;
            }}
          >
            <Bell className="w-5 h-5" />
            <span 
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ backgroundColor: theme.danger }}
            />
          </button>

          {/* Messages */}
          <button 
            onClick={() => onNav('messaging')}
            className="relative p-2.5 rounded-full transition-all active:scale-95"
            style={{ 
              color: currentView === 'messaging' ? theme.primary : theme.textSecondary,
              backgroundColor: currentView === 'messaging' ? theme.primaryLight : 'transparent'
            }}
            onMouseEnter={(e) => {
              if (currentView !== 'messaging') {
                e.currentTarget.style.backgroundColor = theme.primaryLight;
                e.currentTarget.style.color = theme.primary;
              }
            }}
            onMouseLeave={(e) => {
              if (currentView !== 'messaging') {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = theme.textSecondary;
              }
            }}
          >
            <MessageSquare className="w-5 h-5" />
            {unreadMessages > 0 && (
              <span 
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-white text-[10px] font-bold rounded-full px-1"
                style={{ backgroundColor: theme.danger }}
              >
                {unreadMessages > 9 ? '9+' : unreadMessages}
              </span>
            )}
          </button>

          {/* Wallet Button */}
          <button
            onClick={onConnect}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all active:scale-95"
            style={{ 
              backgroundColor: isConnected ? 'transparent' : theme.primary,
              color: isConnected ? theme.primary : '#ffffff',
              border: isConnected ? `1px solid ${theme.border}` : 'none'
            }}
            onMouseEnter={(e) => {
              if (!isConnected) {
                e.currentTarget.style.backgroundColor = theme.primaryHover;
              } else {
                e.currentTarget.style.backgroundColor = theme.primaryLight;
              }
            }}
            onMouseLeave={(e) => {
              if (!isConnected) {
                e.currentTarget.style.backgroundColor = theme.primary;
              } else {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline">{isConnected ? 'Connected' : 'Connect'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

// Tier color definitions
const tierColors: Record<string, { bg: string; color: string; border: string }> = {
  'Free': { bg: 'rgba(113, 118, 123, 0.1)', color: '#71767b', border: 'rgba(113, 118, 123, 0.3)' },
  'Starter': { bg: 'rgba(29, 155, 240, 0.1)', color: '#1d9bf0', border: 'rgba(29, 155, 240, 0.3)' },
  'Pro': { bg: 'rgba(0, 186, 124, 0.1)', color: '#00ba7c', border: 'rgba(0, 186, 124, 0.3)' },
  'Enterprise': { bg: 'rgba(255, 173, 31, 0.1)', color: '#ffad1f', border: 'rgba(255, 173, 31, 0.3)' },
};

export default Navbar;
