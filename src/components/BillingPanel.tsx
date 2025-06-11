import React, { useState, useEffect } from 'react';
import { CreditCard, Download, Calendar, AlertCircle, ExternalLink, Crown, Zap } from 'lucide-react';
import { stripeService, SUBSCRIPTION_PLANS, PricingPlan } from '../services/stripeService';
import { useAudioStore } from '../store/audioStore';
import { toast } from 'react-hot-toast';

export default function BillingPanel() {
  const { user } = useAudioStore();
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usage, setUsage] = useState({
    projects: 12,
    aiCredits: 67,
    storage: 8.5,
    collaborators: 3
  });

  useEffect(() => {
    loadSubscriptionStatus();
  }, []);

  const loadSubscriptionStatus = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const status = await stripeService.getSubscriptionStatus(user.id);
      setSubscriptionStatus(status);
    } catch (error) {
      console.error('Failed to load subscription status:', error);
      toast.error('Failed to load billing information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      // In a real app, you'd have the customer ID from your backend
      await stripeService.createPortalSession('cus_demo_customer_id');
    } catch (error) {
      console.error('Failed to open billing portal:', error);
      toast.error('Failed to open billing portal');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const currentPlan = SUBSCRIPTION_PLANS.find(plan => plan.id === subscriptionStatus?.plan) || SUBSCRIPTION_PLANS[0];
  const usagePercentages = {
    projects: currentPlan.limits.projects === -1 ? 0 : (usage.projects / currentPlan.limits.projects) * 100,
    aiCredits: (usage.aiCredits / currentPlan.limits.aiCredits) * 100,
    storage: (usage.storage / currentPlan.limits.storage) * 100,
    collaborators: currentPlan.limits.collaborators === -1 ? 0 : (usage.collaborators / currentPlan.limits.collaborators) * 100
  };

  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <CreditCard className="w-6 h-6 text-purple-400" />
            <span>Current Subscription</span>
          </h3>
          <button
            onClick={handleManageBilling}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Manage Billing</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                {currentPlan.id === 'enterprise' ? (
                  <Zap className="w-6 h-6 text-white" />
                ) : currentPlan.id === 'pro' ? (
                  <Crown className="w-6 h-6 text-white" />
                ) : (
                  <CreditCard className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white">{currentPlan.name}</h4>
                <p className="text-gray-400">
                  {currentPlan.price === 0 ? 'Free Plan' : `$${currentPlan.price}/month`}
                </p>
              </div>
            </div>

            {subscriptionStatus && subscriptionStatus.status !== 'active' && (
              <div className="flex items-center space-x-2 p-3 bg-yellow-600/20 border border-yellow-500/30 rounded-lg mb-4">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-300 text-sm">
                  Subscription {subscriptionStatus.status}
                </span>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-300">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {subscriptionStatus?.currentPeriodEnd 
                    ? `Renews on ${subscriptionStatus.currentPeriodEnd.toLocaleDateString()}`
                    : 'No renewal date'
                  }
                </span>
              </div>
              {subscriptionStatus?.cancelAtPeriodEnd && (
                <div className="text-sm text-red-400">
                  Subscription will cancel at the end of the current period
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="font-semibold text-gray-300">Plan Features</h5>
            <div className="space-y-2">
              {currentPlan.features.slice(0, 4).map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-sm text-gray-400">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-6">Usage This Month</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 font-medium">Projects</span>
              <span className="text-white">
                {usage.projects}/{currentPlan.limits.projects === -1 ? '∞' : currentPlan.limits.projects}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(usagePercentages.projects, 100)}%` }}
              />
            </div>
            {usagePercentages.projects > 80 && (
              <p className="text-xs text-yellow-400">Approaching limit</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 font-medium">AI Credits</span>
              <span className="text-white">
                {usage.aiCredits}/{currentPlan.limits.aiCredits}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(usagePercentages.aiCredits, 100)}%` }}
              />
            </div>
            {usagePercentages.aiCredits > 80 && (
              <p className="text-xs text-yellow-400">Approaching limit</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 font-medium">Storage</span>
              <span className="text-white">
                {usage.storage}GB/{currentPlan.limits.storage}GB
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(usagePercentages.storage, 100)}%` }}
              />
            </div>
            {usagePercentages.storage > 80 && (
              <p className="text-xs text-yellow-400">Approaching limit</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 font-medium">Collaborators</span>
              <span className="text-white">
                {usage.collaborators}/{currentPlan.limits.collaborators === -1 ? '∞' : currentPlan.limits.collaborators || 0}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(usagePercentages.collaborators, 100)}%` }}
              />
            </div>
            {usagePercentages.collaborators > 80 && (
              <p className="text-xs text-yellow-400">Approaching limit</p>
            )}
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Recent Invoices</h3>
          <button className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors">
            <Download className="w-4 h-4" />
            <span>Download All</span>
          </button>
        </div>

        <div className="space-y-4">
          {[
            { date: '2024-01-01', amount: '$29.00', status: 'Paid', invoice: 'INV-001' },
            { date: '2023-12-01', amount: '$29.00', status: 'Paid', invoice: 'INV-002' },
            { date: '2023-11-01', amount: '$29.00', status: 'Paid', invoice: 'INV-003' },
          ].map((invoice, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-white font-medium">{invoice.invoice}</div>
                  <div className="text-sm text-gray-400">{invoice.date}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-white font-medium">{invoice.amount}</div>
                  <div className="text-sm text-emerald-400">{invoice.status}</div>
                </div>
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}