import React, { useState } from 'react';
import { Music, Headphones, Mic, Settings, Zap, Crown, Users, Bell, Search, User } from 'lucide-react';
import { useAudioStore } from '../store/audioStore';
import SubscriptionModal from './SubscriptionModal';
import { SubscriptionTier } from '../services/subscriptionManager';

export default function Header() {
  const { user, setUser } = useAudioStore();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleUpgrade = (tier: SubscriptionTier) => {
    // Simulate subscription upgrade
    if (user) {
      setUser({ ...user, subscription: tier });
    }
    setShowSubscriptionModal(false);
  };

  const notifications = [
    { id: 1, message: 'Your track "Summer Vibes" processing is complete', time: '2 min ago', type: 'success' },
    { id: 2, message: 'Sarah commented on your project', time: '5 min ago', type: 'info' },
    { id: 3, message: 'New AI model available for hip-hop enhancement', time: '1 hour ago', type: 'update' }
  ];

  return (
    <>
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-xl border-b border-purple-500/30 px-6 py-4 shadow-2xl sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <div className="relative bg-gray-900 rounded-full p-2">
                <Music className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Rehab re-hype
                </h1>
                <Crown className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-sm text-gray-400 font-medium">Digital Recovery & Restoration Suite v2.0 Pro</p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects, collaborators, or features..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Status Indicators */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-emerald-600/20 px-3 py-1 rounded-full border border-emerald-500/30">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-400 text-sm font-medium">AI Engine Active</span>
              </div>
              
              {user && (
                <button
                  onClick={() => setShowSubscriptionModal(true)}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-full border transition-all duration-300 ${
                    user.subscription === 'enterprise'
                      ? 'bg-yellow-600/20 border-yellow-500/30 text-yellow-400'
                      : user.subscription === 'pro'
                      ? 'bg-purple-600/20 border-purple-500/30 text-purple-400'
                      : 'bg-gray-600/20 border-gray-500/30 text-gray-400 hover:border-purple-500/50'
                  }`}
                >
                  {user.subscription === 'enterprise' ? (
                    <Crown className="w-3 h-3" />
                  ) : user.subscription === 'pro' ? (
                    <Zap className="w-3 h-3" />
                  ) : (
                    <Users className="w-3 h-3" />
                  )}
                  <span className="text-sm font-medium capitalize">{user.subscription}</span>
                </button>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-gray-800/50 rounded-lg relative"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50">
                    <div className="p-4 border-b border-gray-700">
                      <h3 className="font-semibold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                          <p className="text-sm text-gray-300">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-gray-800/50 rounded-lg">
                <Headphones className="w-5 h-5" />
              </button>
              
              <button className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-gray-800/50 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 text-gray-400 hover:text-white transition-colors hover:bg-gray-800/50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 top-12 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50">
                    <div className="p-4 border-b border-gray-700">
                      <p className="font-semibold text-white">{user?.email || 'Guest User'}</p>
                      <p className="text-sm text-gray-400 capitalize">{user?.subscription || 'Free'} Plan</p>
                    </div>
                    <div className="p-2">
                      <button className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                        Profile Settings
                      </button>
                      <button className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                        Billing & Usage
                      </button>
                      <button
                        onClick={() => setShowSubscriptionModal(true)}
                        className="w-full text-left px-3 py-2 text-purple-400 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        Upgrade Plan
                      </button>
                      <hr className="my-2 border-gray-700" />
                      <button className="w-full text-left px-3 py-2 text-red-400 hover:bg-gray-800 rounded-lg transition-colors">
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        currentTier={user?.subscription || 'free'}
        onUpgrade={handleUpgrade}
      />
    </>
  );
}