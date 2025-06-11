import React, { useState, useEffect } from 'react';
import { X, Copy, ExternalLink, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { cryptoPaymentService, CryptoPaymentRequest, CryptoPrice, CryptoCurrency } from '../services/cryptoPaymentService';
import { toast } from 'react-hot-toast';

interface CryptoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number; // USD amount
  planName: string;
}

export default function CryptoPaymentModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  amount, 
  planName 
}: CryptoPaymentModalProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<CryptoCurrency>('bitcoin');
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([]);
  const [paymentRequest, setPaymentRequest] = useState<CryptoPaymentRequest | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'selecting' | 'pending' | 'confirmed' | 'failed' | 'expired'>('selecting');
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCryptoPrices();
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (paymentRequest && paymentStatus === 'pending') {
      interval = setInterval(async () => {
        try {
          const status = await cryptoPaymentService.checkPaymentStatus(paymentRequest.paymentId);
          setPaymentStatus(status.status);
          
          if (status.status === 'confirmed') {
            toast.success('Payment confirmed! Welcome to your new plan!');
            setTimeout(() => {
              onSuccess();
              onClose();
            }, 2000);
          } else if (status.status === 'failed' || status.status === 'expired') {
            toast.error(`Payment ${status.status}`);
          }
        } catch (error) {
          console.error('Failed to check payment status:', error);
        }
      }, 5000); // Check every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [paymentRequest, paymentStatus, onSuccess, onClose]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (paymentRequest && paymentStatus === 'pending') {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const expires = new Date(paymentRequest.expiresAt).getTime();
        const remaining = Math.max(0, expires - now);
        
        setTimeRemaining(remaining);
        
        if (remaining === 0) {
          setPaymentStatus('expired');
          toast.error('Payment expired. Please try again.');
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [paymentRequest, paymentStatus]);

  const loadCryptoPrices = async () => {
    try {
      const prices = await cryptoPaymentService.getCryptoPrices();
      setCryptoPrices(prices);
    } catch (error) {
      console.error('Failed to load crypto prices:', error);
    }
  };

  const handleCreatePayment = async () => {
    setIsLoading(true);
    try {
      const request = await cryptoPaymentService.createCryptoPayment(selectedCurrency, amount);
      setPaymentRequest(request);
      setPaymentStatus('pending');
      toast.success('Payment request created! Send the exact amount to complete your purchase.');
    } catch (error) {
      console.error('Failed to create payment:', error);
      toast.error('Failed to create payment request');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-400 animate-pulse" />;
      case 'confirmed':
        return <CheckCircle className="w-6 h-6 text-emerald-400" />;
      case 'failed':
      case 'expired':
        return <AlertCircle className="w-6 h-6 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'pending':
        return 'Waiting for payment confirmation...';
      case 'confirmed':
        return 'Payment confirmed! Activating your subscription...';
      case 'failed':
        return 'Payment failed. Please try again.';
      case 'expired':
        return 'Payment expired. Please create a new payment request.';
      default:
        return '';
    }
  };

  if (!isOpen) return null;

  const selectedPrice = cryptoPrices.find(p => p.currency === selectedCurrency);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Cryptocurrency Payment</h2>
              <p className="text-gray-400">
                Upgrade to {planName} - {cryptoPaymentService.formatUsdAmount(amount)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {paymentStatus === 'selecting' && (
            <>
              {/* Currency Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Select Cryptocurrency</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cryptoPrices.map((crypto) => (
                    <button
                      key={crypto.currency}
                      onClick={() => setSelectedCurrency(crypto.currency)}
                      className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                        selectedCurrency === crypto.currency
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-600 hover:border-gray-500 bg-gray-700/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{crypto.icon}</span>
                          <div>
                            <div className="font-semibold text-white">{crypto.name}</div>
                            <div className="text-sm text-gray-400">{crypto.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">
                            {cryptoPaymentService.formatUsdAmount(crypto.price)}
                          </div>
                          <div className={`text-sm ${crypto.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      {selectedCurrency === crypto.currency && selectedPrice && (
                        <div className="mt-3 pt-3 border-t border-gray-600">
                          <div className="text-sm text-gray-300">
                            You'll pay: <span className="font-semibold text-white">
                              {cryptoPaymentService.formatCryptoAmount(amount / crypto.price, crypto.currency)} {crypto.symbol}
                            </span>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Create Payment Button */}
              <button
                onClick={handleCreatePayment}
                disabled={isLoading || !selectedPrice}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                  isLoading
                    ? 'bg-yellow-600 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:shadow-2xl hover:scale-105'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    <span>Creating Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Create Payment Request</span>
                    {selectedPrice && (
                      <span className="text-sm opacity-80">
                        ({cryptoPaymentService.formatCryptoAmount(amount / selectedPrice.price, selectedCurrency)} {selectedPrice.symbol})
                      </span>
                    )}
                  </>
                )}
              </button>
            </>
          )}

          {paymentRequest && paymentStatus !== 'selecting' && (
            <>
              {/* Payment Status */}
              <div className="mb-8 text-center">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  {getStatusIcon()}
                  <span className="text-lg font-semibold text-white">{getStatusMessage()}</span>
                </div>
                
                {paymentStatus === 'pending' && (
                  <div className="text-sm text-gray-400">
                    Time remaining: <span className="font-mono text-yellow-400">
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                )}
              </div>

              {paymentStatus === 'pending' && (
                <>
                  {/* QR Code */}
                  <div className="mb-8 text-center">
                    <div className="bg-white p-4 rounded-xl inline-block mb-4">
                      <img 
                        src={paymentRequest.qrCode} 
                        alt="Payment QR Code" 
                        className="w-48 h-48"
                      />
                    </div>
                    <p className="text-sm text-gray-400">
                      Scan with your {selectedPrice?.name} wallet
                    </p>
                  </div>

                  {/* Payment Details */}
                  <div className="space-y-4 mb-8">
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Amount to Send</span>
                        <button
                          onClick={() => copyToClipboard(
                            cryptoPaymentService.formatCryptoAmount(paymentRequest.amount, selectedCurrency),
                            'Amount'
                          )}
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="font-mono text-lg text-white">
                        {cryptoPaymentService.formatCryptoAmount(paymentRequest.amount, selectedCurrency)} {selectedPrice?.symbol}
                      </div>
                      <div className="text-sm text-gray-400">
                        ≈ {cryptoPaymentService.formatUsdAmount(paymentRequest.usdAmount)}
                      </div>
                    </div>

                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Send to Address</span>
                        <button
                          onClick={() => copyToClipboard(paymentRequest.address, 'Address')}
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="font-mono text-sm text-white break-all">
                        {paymentRequest.address}
                      </div>
                    </div>
                  </div>

                  {/* Important Notes */}
                  <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-yellow-400 mb-2">Important:</h4>
                    <ul className="text-sm text-yellow-300 space-y-1">
                      <li>• Send the exact amount shown above</li>
                      <li>• Payment will expire in {formatTime(timeRemaining)}</li>
                      <li>• Network fees are not included in the amount</li>
                      <li>• Confirmation may take several minutes</li>
                    </ul>
                  </div>
                </>
              )}

              {(paymentStatus === 'failed' || paymentStatus === 'expired') && (
                <div className="text-center">
                  <button
                    onClick={() => {
                      setPaymentStatus('selecting');
                      setPaymentRequest(null);
                    }}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Try Again</span>
                  </button>
                </div>
              )}
            </>
          )}

          {/* Security Notice */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>Secure payments</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>No personal data stored</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>Instant activation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}