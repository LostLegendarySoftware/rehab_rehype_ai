import React, { useState } from 'react';
import { X, Check, Crown, Zap, Users, Star, ArrowRight, CreditCard } from 'lucide-react';
import { SUBSCRIPTION_PLANS, stripeService, PricingPlan } from '../services/stripeService';
import { useAudioStore } from '../store/audioStore';
import { toast } from 'react-hot-toast';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: PricingPlan;
}

export default function PricingModal({ isOpen, onClose, currentPlan = 'free' }: PricingModalProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const { user } = useAudioStore();

  if (!isOpen) return null;

  const handleUpgrade = async (planId: PricingPlan) => {
    if (planId === 'free' || planId === currentPlan) return;

    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan || !plan.stripePriceId) {
      toast.error('Plan not available');
      return;
    }

    setIsLoading(planId);
    
    try {
      await stripeService.createCheckoutSession(plan.stripePriceId, user?.id || 'demo-user');
    } catch (error) {
      console.error('Upgrade failed:', error);
      toast.error('Failed to start upgrade process');
    } finally {
      setIsLoading(null);
    }
  };

  const getPlanIcon = (planId: PricingPlan) => {
    switch (planId) {
      case 'free': return Users;
      case 'pro': return Crown;
      case 'enterprise': return Zap;
      default: return Users;
    }
  };

  const getPlanColor = (planId: PricingPlan) => {
    switch (planId) {
      case 'free': return 'from-gray-500 to-gray-600';
      case 'pro': return 'from-purple-500 to-cyan-500';
      case 'enterprise': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h2>
              <p className="text-gray-400">Unlock professional audio production capabilities</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gray-800/50 rounded-xl p-1 flex">
              <button
                onClick={() => setBillingInterval('month')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  billingInterval === 'month'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval('year')}
                className={`px-6 py-2 rounded-lg font-medium transition-all relative ${
                  billingInterval === 'year'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Yearly
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const Icon = getPlanIcon(plan.id);
              const isCurrentPlan = currentPlan === plan.id;
              const isPopular = plan.id === 'pro';
              const yearlyPrice = billingInterval === 'year' ? plan.price * 12 * 0.8 : plan.price;
              const displayPrice = billingInterval === 'year' ? yearlyPrice / 12 : plan.price;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl border-2 p-8 transition-all duration-300 ${
                    isPopular
                      ? 'border-purple-500 bg-purple-500/10 scale-105'
                      : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>Most Popular</span>
                      </div>
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Current Plan
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${getPlanColor(plan.id)} flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-white">
                        {plan.price === 0 ? 'Free' : `$${Math.round(displayPrice)}`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-400 ml-2">
                          /{billingInterval === 'year' ? 'month' : 'month'}
                        </span>
                      )}
                    </div>
                    {billingInterval === 'year' && plan.price > 0 && (
                      <div className="text-sm text-emerald-400">
                        ${Math.round(yearlyPrice)} billed annually
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limits */}
                  <div className="space-y-3 mb-8 p-4 bg-gray-700/30 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Projects</span>
                      <span className="text-white font-medium">
                        {plan.limits.projects === -1 ? 'Unlimited' : plan.limits.projects}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">AI Credits/month</span>
                      <span className="text-white font-medium">{plan.limits.aiCredits}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Storage</span>
                      <span className="text-white font-medium">{plan.limits.storage}GB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Collaborators</span>
                      <span className="text-white font-medium">
                        {plan.limits.collaborators === -1 ? 'Unlimited' : plan.limits.collaborators || 'None'}
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrentPlan || isLoading === plan.id || plan.id === 'free'}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                      isCurrentPlan
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : plan.id === 'free'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : isLoading === plan.id
                        ? 'bg-yellow-600 text-white cursor-not-allowed'
                        : `bg-gradient-to-r ${getPlanColor(plan.id)} text-white hover:shadow-2xl hover:scale-105`
                    }`}
                  >
                    {isLoading === plan.id ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        <span>Processing...</span>
                      </>
                    ) : isCurrentPlan ? (
                      'Current Plan'
                    ) : plan.id === 'free' ? (
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

          {/* Features Comparison */}
          <div className="bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold text-white mb-4 text-center">🎵 All Plans Include</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="font-semibold text-white">AI Enhancement</h4>
                <p className="text-sm text-gray-400">Transform lo-fi to radio quality</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-cyan-600/20 rounded-full flex items-center justify-center mx-auto">
                  <Crown className="w-6 h-6 text-cyan-400" />
                </div>
                <h4 className="font-semibold text-white">Genre Matching</h4>
                <p className="text-sm text-gray-400">Match top artist styles</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="font-semibold text-white">Cloud Sync</h4>
                <p className="text-sm text-gray-400">Access anywhere, anytime</p>
              </div>
            </div>
          </div>

          {/* Security & Guarantee */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Secure payments by Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}