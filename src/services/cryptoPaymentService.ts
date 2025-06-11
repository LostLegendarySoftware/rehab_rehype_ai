import { toast } from 'react-hot-toast';
import QRCode from 'qrcode';

export type CryptoCurrency = 'bitcoin' | 'ethereum' | 'solana' | 'dogecoin' | 'usdt';

export interface CryptoPaymentRequest {
  currency: CryptoCurrency;
  amount: number;
  usdAmount: number;
  address: string;
  qrCode: string;
  expiresAt: Date;
  paymentId: string;
}

export interface CryptoPrice {
  currency: CryptoCurrency;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  icon: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'crypto' | 'card';
  icon: string;
  description: string;
  processingTime: string;
  fees: string;
}

class CryptoPaymentService {
  private apiKey = 'demo-api-key'; // In production, this would be from environment
  private baseUrl = 'https://api.rehabrehype.com/payments';

  // Demo wallet addresses - in production these would be generated dynamically
  private walletAddresses = {
    bitcoin: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    ethereum: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    solana: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    dogecoin: 'DH5yaieqoZN36fDVciNyRueRGvGLR3mr7L',
    usdt: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6' // ERC-20 USDT
  };

  async getCryptoPrices(): Promise<CryptoPrice[]> {
    try {
      // In production, this would fetch from a real API like CoinGecko
      // For demo purposes, we'll return mock data
      return [
        {
          currency: 'bitcoin',
          symbol: 'BTC',
          name: 'Bitcoin',
          price: 43250.00,
          change24h: 2.5,
          icon: '₿'
        },
        {
          currency: 'ethereum',
          symbol: 'ETH',
          name: 'Ethereum',
          price: 2650.00,
          change24h: -1.2,
          icon: 'Ξ'
        },
        {
          currency: 'solana',
          symbol: 'SOL',
          name: 'Solana',
          price: 98.50,
          change24h: 5.8,
          icon: '◎'
        },
        {
          currency: 'dogecoin',
          symbol: 'DOGE',
          name: 'Dogecoin',
          price: 0.085,
          change24h: 3.2,
          icon: 'Ð'
        },
        {
          currency: 'usdt',
          symbol: 'USDT',
          name: 'Tether USD',
          price: 1.00,
          change24h: 0.1,
          icon: '₮'
        }
      ];
    } catch (error) {
      console.error('Failed to fetch crypto prices:', error);
      toast.error('Failed to load cryptocurrency prices');
      throw error;
    }
  }

  async createCryptoPayment(
    currency: CryptoCurrency,
    usdAmount: number
  ): Promise<CryptoPaymentRequest> {
    try {
      const prices = await this.getCryptoPrices();
      const cryptoPrice = prices.find(p => p.currency === currency);
      
      if (!cryptoPrice) {
        throw new Error(`Price not found for ${currency}`);
      }

      const cryptoAmount = usdAmount / cryptoPrice.price;
      const address = this.walletAddresses[currency];
      const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Generate payment URI for QR code
      const paymentUri = this.generatePaymentUri(currency, address, cryptoAmount);
      const qrCode = await QRCode.toDataURL(paymentUri, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      const paymentRequest: CryptoPaymentRequest = {
        currency,
        amount: cryptoAmount,
        usdAmount,
        address,
        qrCode,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
        paymentId
      };

      // In production, save this to your backend
      this.savePaymentRequest(paymentRequest);

      return paymentRequest;
    } catch (error) {
      console.error('Failed to create crypto payment:', error);
      toast.error('Failed to create cryptocurrency payment');
      throw error;
    }
  }

  private generatePaymentUri(currency: CryptoCurrency, address: string, amount: number): string {
    switch (currency) {
      case 'bitcoin':
        return `bitcoin:${address}?amount=${amount.toFixed(8)}`;
      case 'ethereum':
        return `ethereum:${address}?value=${(amount * 1e18).toString()}`;
      case 'solana':
        return `solana:${address}?amount=${amount}`;
      case 'dogecoin':
        return `dogecoin:${address}?amount=${amount.toFixed(8)}`;
      case 'usdt':
        return `ethereum:${address}?value=${(amount * 1e6).toString()}`;
      default:
        return address;
    }
  }

  private async savePaymentRequest(request: CryptoPaymentRequest): Promise<void> {
    try {
      // In production, this would save to your backend
      localStorage.setItem(`payment_${request.paymentId}`, JSON.stringify(request));
    } catch (error) {
      console.warn('Failed to save payment request:', error);
    }
  }

  async checkPaymentStatus(paymentId: string): Promise<{
    status: 'pending' | 'confirmed' | 'failed' | 'expired';
    confirmations?: number;
    txHash?: string;
  }> {
    try {
      // In production, this would check the blockchain or payment processor
      // For demo purposes, we'll simulate payment confirmation after 30 seconds
      const request = localStorage.getItem(`payment_${paymentId}`);
      if (!request) {
        return { status: 'failed' };
      }

      const paymentRequest = JSON.parse(request);
      const now = new Date();
      const created = new Date(paymentRequest.expiresAt).getTime() - (30 * 60 * 1000);
      const elapsed = now.getTime() - created;

      if (elapsed > 30 * 60 * 1000) { // 30 minutes
        return { status: 'expired' };
      }

      if (elapsed > 30000) { // 30 seconds for demo
        return {
          status: 'confirmed',
          confirmations: 6,
          txHash: `0x${Math.random().toString(16).substr(2, 64)}`
        };
      }

      return { status: 'pending' };
    } catch (error) {
      console.error('Failed to check payment status:', error);
      return { status: 'failed' };
    }
  }

  getPaymentMethods(): PaymentMethod[] {
    return [
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        type: 'crypto',
        icon: '₿',
        description: 'Secure, decentralized digital currency',
        processingTime: '10-60 minutes',
        fees: 'Network fees apply'
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        type: 'crypto',
        icon: 'Ξ',
        description: 'Smart contract platform currency',
        processingTime: '2-15 minutes',
        fees: 'Gas fees apply'
      },
      {
        id: 'solana',
        name: 'Solana',
        type: 'crypto',
        icon: '◎',
        description: 'Fast, low-cost blockchain',
        processingTime: '1-2 minutes',
        fees: 'Very low fees'
      },
      {
        id: 'dogecoin',
        name: 'Dogecoin',
        type: 'crypto',
        icon: 'Ð',
        description: 'Fun, community-driven cryptocurrency',
        processingTime: '5-30 minutes',
        fees: 'Low network fees'
      },
      {
        id: 'usdt',
        name: 'USDT (Tether)',
        type: 'crypto',
        icon: '₮',
        description: 'Stable coin pegged to USD',
        processingTime: '2-15 minutes',
        fees: 'Gas fees apply'
      },
      {
        id: 'credit-card',
        name: 'Credit Card',
        type: 'card',
        icon: '💳',
        description: 'Visa, Mastercard, American Express',
        processingTime: 'Instant',
        fees: '2.9% + $0.30'
      },
      {
        id: 'debit-card',
        name: 'Debit Card',
        type: 'card',
        icon: '💳',
        description: 'Direct bank account payment',
        processingTime: 'Instant',
        fees: '2.9% + $0.30'
      }
    ];
  }

  formatCryptoAmount(amount: number, currency: CryptoCurrency): string {
    const decimals = currency === 'bitcoin' ? 8 : currency === 'dogecoin' ? 8 : 6;
    return amount.toFixed(decimals);
  }

  formatUsdAmount(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  async validateCryptoAddress(address: string, currency: CryptoCurrency): Promise<boolean> {
    try {
      // Basic validation patterns - in production, use proper validation libraries
      const patterns = {
        bitcoin: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/,
        ethereum: /^0x[a-fA-F0-9]{40}$/,
        solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
        dogecoin: /^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$/,
        usdt: /^0x[a-fA-F0-9]{40}$/ // ERC-20 address
      };

      return patterns[currency]?.test(address) || false;
    } catch (error) {
      console.error('Address validation failed:', error);
      return false;
    }
  }
}

export const cryptoPaymentService = new CryptoPaymentService();