import React, { useState } from 'react';
import { X, Check, Crown, Zap, Users, Star, ArrowRight, CreditCard } from 'lucide-react';
import { SubscriptionManager, SubscriptionTier } from '../services/subscriptionManager';
import { stripeService } from '../services/stripeService';
import { useAudioStore } from '../store/audioStore';
import { toast } from 'react-hot-toast';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: SubscriptionTier;
  onUpgrade: (tier: SubscriptionTier) => void;
}

export default function SubscriptionModal({ isOpen, onClose, currentTier, onUpgrade }: SubscriptionModalProps) {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('pro');
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { user } = useAudioStore();

  if (!isOpen) return null;

  const handleUpgrade = async (tier: SubscriptionTier) => {
    if (tier === 'free' || tier === currentTier) return;

    setIsLoading(tier);
    
    try {
      // Get the corresponding Stripe price ID
      const stripePriceId = tier === 'pro' ? 'price_1234567890' : 'price_0987654321';
      await stripeService.createCheckoutSession(stripePriceId, user?.id || 'demo-user');
    } catch (error) {
      console.error('Upgrade failed:', error);
      toast.error('Failed to start upgrade process');
    } finally {
      setIsLoading(null);
    }
  };

  const tiers = [
    {
      id: 'free' as SubscriptionTier,
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out our platform',
      color: 'from-gray-500 to-gray-600',
      icon: Sparkles,
      popular: false
    },
    {
      id: 'pro' as SubscriptionTier,
      name: 'Professional',
      price: '$29',
      period: 'per month',
      description: 'For serious music producers and artists',
      color: 'from-purple-500 to-cyan-500',
      icon: Crown,
      popular: true
    },
    {
      id: 'enterprise' as SubscriptionTier,
      name: 'Enterprise',
      price: '$99',
      period: 'per month',
      description: 'For studios and professional teams',
      color: 'from-yellow-500 to-orange-500',
      icon: Zap,
      popular: false
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h2>
              <p className="text-gray-400">Unlock the full potential of professional audio production</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier) => {
              const limits = SubscriptionManager.getLimits(tier.id);
              const Icon = tier.icon;
              const isCurrentTier = currentTier === tier.id;
              const isSelected = selectedTier === tier.id;

              return (
                <div
                  key={tier.id}
                  className={`relative rounded-2xl border-2 p-8 transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/10 scale-105'
                      : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                  } ${tier.popular ? 'ring-2 ring-purple-400/50' : ''}`}
                  onClick={() => setSelectedTier(tier.id)}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-white">{tier.price}</span>
                      <span className="text-gray-400 ml-2">{tier.period}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{tier.description}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Crown className="w-5 h-5 text-purple-400" />
                      <span className="text-gray-300">
                        {limits.maxProjects === -1 ? 'Unlimited' : limits.maxProjects} Projects
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      <span className="text-gray-300">
                        {limits.aiCreditsPerMonth} AI Credits/month
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-emerald-400" />
                      <span className="text-gray-300">
                        {limits.collaborators === -1 ? 'Unlimited' : limits.collaborators === 0 ? 'No' : limits.collaborators} Collaborators
                      </span>
                    </div>

                    {limits.advancedFeatures.length > 0 && (
                      <div className="pt-4 border-t border-gray-700">
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Advanced Features:</h4>
                        <div className="space-y-2">
                          {limits.advancedFeatures.slice(0, 3).map((feature) => (
                            <div key={feature} className="flex items-center space-x-2">
                              <Check className="w-4 h-4 text-emerald-400" />
                              <span className="text-sm text-gray-400 capitalize">
                                {feature.replace('-', ' ')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleUpgrade(tier.id)}
                    disabled={isCurrentTier || isLoading === tier.id}
                    className={`w-full mt-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                      isCurrentTier
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : isLoading === tier.id
                        ? 'bg-yellow-600 text-white cursor-not-allowed'
                        : isSelected
                        ? `bg-gradient-to-r ${tier.color} text-white hover:shadow-2xl hover:scale-105`
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {isLoading === tier.id ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        <span>Processing...</span>
                      </>
                    ) : isCurrentTier ? (
                      'Current Plan'
                    ) : tier.id === 'free' ? (
                      'Get Started'
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        <span>Upgrade Now</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold text-white mb-4">🎵 30-Day Money-Back Guarantee</h3>
              <p className="text-gray-300 mb-4">
                Try any paid plan risk-free. If you're not completely satisfied, we'll refund your money within 30 days.
              </p>
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Instant activation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}