import React, { useState } from 'react';
import { CreditCard, Smartphone, Shield, Zap } from 'lucide-react';
import { cryptoPaymentService, PaymentMethod } from '../services/cryptoPaymentService';
import { stripeService } from '../services/stripeService';
import CryptoPaymentModal from './CryptoPaymentModal';
import { toast } from 'react-hot-toast';

interface PaymentMethodSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  planName: string;
  planId: string;
}

export default function PaymentMethodSelector({
  isOpen,
  onClose,
  onSuccess,
  amount,
  planName,
  planId
}: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const paymentMethods = cryptoPaymentService.getPaymentMethods();

  const handleMethodSelect = async (methodId: string) => {
    setSelectedMethod(methodId);
    
    if (methodId === 'credit-card' || methodId === 'debit-card') {
      setIsProcessing(true);
      try {
        // Use Stripe for card payments
        const stripePriceId = planId === 'pro' ? 'price_1234567890' : 'price_0987654321';
        await stripeService.createCheckoutSession(stripePriceId, 'demo-user');
      } catch (error) {
        console.error('Card payment failed:', error);
        toast.error('Failed to process card payment');
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Crypto payment
      setShowCryptoModal(true);
    }
  };

  const getMethodIcon = (method: PaymentMethod) => {
    if (method.type === 'card') {
      return <CreditCard className="w-8 h-8 text-blue-400" />;
    }
    
    // Crypto icons
    const cryptoIcons: Record<string, string> = {
      bitcoin: '₿',
      ethereum: 'Ξ',
      solana: '◎',
      dogecoin: 'Ð',
      usdt: '₮'
    };
    
    return (
      <div className="w-8 h-8 flex items-center justify-center text-2xl font-bold text-orange-400">
        {cryptoIcons[method.id] || '🪙'}
      </div>
    );
  };

  const getMethodColor = (method: PaymentMethod) => {
    if (method.type === 'card') {
      return 'from-blue-500 to-cyan-500';
    }
    
    const cryptoColors: Record<string, string> = {
      bitcoin: 'from-orange-500 to-yellow-500',
      ethereum: 'from-purple-500 to-blue-500',
      solana: 'from-green-500 to-teal-500',
      dogecoin: 'from-yellow-500 to-orange-500',
      usdt: 'from-green-500 to-emerald-500'
    };
    
    return cryptoColors[method.id] || 'from-gray-500 to-gray-600';
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Choose Payment Method</h2>
              <p className="text-gray-400">
                Upgrade to {planName} - {cryptoPaymentService.formatUsdAmount(amount)}
              </p>
            </div>

            {/* Payment Methods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handleMethodSelect(method.id)}
                  disabled={isProcessing}
                  className={`p-6 rounded-xl border-2 text-left transition-all duration-300 group hover:scale-105 ${
                    selectedMethod === method.id
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-600 hover:border-gray-500 bg-gray-700/30'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    {getMethodIcon(method)}
                    <div>
                      <h3 className="font-semibold text-white text-lg">{method.name}</h3>
                      <p className="text-sm text-gray-400">{method.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Processing Time:</span>
                      <span className="text-white">{method.processingTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Fees:</span>
                      <span className="text-white">{method.fees}</span>
                    </div>
                  </div>

                  <div className={`w-full h-1 bg-gradient-to-r ${getMethodColor(method)} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  {method.type === 'crypto' && (
                    <div className="mt-3 flex items-center space-x-2 text-xs text-emerald-400">
                      <Shield className="w-3 h-3" />
                      <span>Decentralized & Secure</span>
                    </div>
                  )}
                  
                  {method.type === 'card' && (
                    <div className="mt-3 flex items-center space-x-2 text-xs text-blue-400">
                      <Zap className="w-3 h-3" />
                      <span>Instant Processing</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Features Comparison */}
            <div className="bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-xl p-6 border border-purple-500/20 mb-8">
              <h3 className="text-lg font-bold text-white mb-4 text-center">Payment Method Comparison</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-cyan-400 mb-3 flex items-center space-x-2">
                    <span>🪙</span>
                    <span>Cryptocurrency Benefits</span>
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                      <span>No personal data required</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                      <span>Decentralized and secure</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                      <span>Global accessibility</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                      <span>Lower fees (network dependent)</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-400 mb-3 flex items-center space-x-2">
                    <span>💳</span>
                    <span>Credit/Debit Card Benefits</span>
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      <span>Instant processing</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      <span>Familiar payment method</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      <span>Buyer protection</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      <span>Easy refunds</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-400 mb-6">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>PCI DSS compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <CryptoPaymentModal
        isOpen={showCryptoModal}
        onClose={() => setShowCryptoModal(false)}
        onSuccess={() => {
          setShowCryptoModal(false);
          onSuccess();
        }}
        amount={amount}
        planName={planName}
      />
    </>
  );
}