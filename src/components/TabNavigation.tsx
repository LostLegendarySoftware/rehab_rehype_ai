import React from 'react';
import { Upload, Bot, Mic, Scissors, Download, Sliders, Sparkles, Users, BarChart3 } from 'lucide-react';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showCollaboration: boolean;
  setShowCollaboration: (show: boolean) => void;
  showAnalytics: boolean;
  setShowAnalytics: (show: boolean) => void;
}

const tabs = [
  { id: 'enhance', label: 'AI Enhance', icon: Upload, color: 'purple' },
  { id: 'chat', label: 'AI Assistant', icon: Bot, color: 'cyan' },
  { id: 'record', label: 'Studio Record', icon: Mic, color: 'red' },
  { id: 'separate', label: 'Track Separate', icon: Scissors, color: 'emerald' },
  { id: 'master', label: 'Pro Master', icon: Sliders, color: 'yellow' },
  { id: 'export', label: 'Export Suite', icon: Download, color: 'blue' },
];

const utilityTabs = [
  { id: 'collaboration', label: 'Team Collab', icon: Users, color: 'pink' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'orange' },
];

const colorClasses = {
  purple: 'text-purple-400 border-purple-400 bg-purple-400/10 shadow-purple-400/20',
  cyan: 'text-cyan-400 border-cyan-400 bg-cyan-400/10 shadow-cyan-400/20',
  red: 'text-red-400 border-red-400 bg-red-400/10 shadow-red-400/20',
  emerald: 'text-emerald-400 border-emerald-400 bg-emerald-400/10 shadow-emerald-400/20',
  yellow: 'text-yellow-400 border-yellow-400 bg-yellow-400/10 shadow-yellow-400/20',
  blue: 'text-blue-400 border-blue-400 bg-blue-400/10 shadow-blue-400/20',
  pink: 'text-pink-400 border-pink-400 bg-pink-400/10 shadow-pink-400/20',
  orange: 'text-orange-400 border-orange-400 bg-orange-400/10 shadow-orange-400/20',
};

export default function TabNavigation({ 
  activeTab, 
  setActiveTab, 
  showCollaboration, 
  setShowCollaboration,
  showAnalytics,
  setShowAnalytics
}: TabNavigationProps) {
  
  const handleTabClick = (tabId: string) => {
    if (tabId === 'collaboration') {
      setShowCollaboration(!showCollaboration);
      setShowAnalytics(false);
      if (showCollaboration) {
        // If closing collaboration, don't change active tab
        return;
      }
    } else if (tabId === 'analytics') {
      setShowAnalytics(!showAnalytics);
      setShowCollaboration(false);
      if (showAnalytics) {
        return;
      }
    } else {
      setActiveTab(tabId);
      setShowCollaboration(false);
      setShowAnalytics(false);
    }
  };

  return (
    <nav className="bg-gray-800/60 backdrop-blur-xl border-b border-gray-700/50 px-6 sticky top-16 z-40">
      <div className="flex space-x-1 max-w-7xl mx-auto overflow-x-auto">
        {/* Main Tabs */}
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id && !showCollaboration && !showAnalytics;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-semibold transition-all duration-300 border-b-3 relative group whitespace-nowrap ${
                isActive
                  ? `${colorClasses[tab.color as keyof typeof colorClasses]} shadow-lg`
                  : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600 hover:bg-gray-700/30'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
              <span>{tab.label}</span>
              {isActive && (
                <Sparkles className="w-3 h-3 animate-spin" />
              )}
              
              {/* Glow effect for active tab */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-10 blur-sm" />
              )}
            </button>
          );
        })}

        {/* Separator */}
        <div className="w-px bg-gray-600 my-2" />

        {/* Utility Tabs */}
        {utilityTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = (tab.id === 'collaboration' && showCollaboration) || 
                          (tab.id === 'analytics' && showAnalytics);
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-semibold transition-all duration-300 border-b-3 relative group whitespace-nowrap ${
                isActive
                  ? `${colorClasses[tab.color as keyof typeof colorClasses]} shadow-lg`
                  : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600 hover:bg-gray-700/30'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
              <span>{tab.label}</span>
              {isActive && (
                <Sparkles className="w-3 h-3 animate-spin" />
              )}
              
              {/* Glow effect for active tab */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-10 blur-sm" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}