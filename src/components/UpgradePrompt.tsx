import React from 'react';
import { Crown, Zap, ArrowRight, X } from 'lucide-react';
import { PricingPlan } from '../services/stripeService';

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  feature: string;
  currentPlan: PricingPlan;
  requiredPlan: PricingPlan;
}

export default function UpgradePrompt({ 
  isOpen, 
  onClose, 
  onUpgrade, 
  feature, 
  currentPlan, 
  requiredPlan 
}: UpgradePromptProps) {
  if (!isOpen) return null;

  const getUpgradeMessage = () => {
    switch (feature) {
      case 'ai-credits':
        return 'You\'ve reached your monthly AI processing limit';
      case 'projects':
        return 'You\'ve reached your project limit';
      case 'collaborators':
        return 'Add team members to collaborate on projects';
      case 'export-formats':
        return 'Unlock professional export formats';
      case 'advanced-features':
        return 'Access advanced AI features and processing';
      default:
        return 'Upgrade to unlock this feature';
    }
  };

  const getUpgradeBenefits = () => {
    if (requiredPlan === 'pro') {
      return [
        '100 AI credits per month',
        '50 projects',
        'Team collaboration',
        'All export formats',
        'Priority processing',
        'Advanced AI features'
      ];
    } else {
      return [
        'Unlimited projects',
        '1000 AI credits per month',
        'Unlimited collaborators',
        'API access',
        'Custom AI models',
        'White-label options'
      ];
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 max-w-md w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center">
              {requiredPlan === 'enterprise' ? (
                <Zap className="w-6 h-6 text-white" />
              ) : (
                <Crown className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Upgrade Required</h3>
              <p className="text-gray-400 text-sm capitalize">{currentPlan} → {requiredPlan}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 mb-4">{getUpgradeMessage()}</p>
          
          <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
            <h4 className="text-white font-semibold mb-3">Unlock with {requiredPlan}:</h4>
            <div className="space-y-2">
              {getUpgradeBenefits().map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Maybe Later
          </button>
          <button
            onClick={onUpgrade}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>Upgrade Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            30-day money-back guarantee • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}