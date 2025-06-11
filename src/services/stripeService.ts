import { loadStripe, Stripe } from '@stripe/stripe-js';
import { toast } from 'react-hot-toast';

export type PricingPlan = 'free' | 'pro' | 'enterprise';

export interface SubscriptionPlan {
  id: PricingPlan;
  name: string;
  price: number;
  interval: 'month' | 'year';
  stripePriceId: string;
  features: string[];
  limits: {
    projects: number;
    aiCredits: number;
    storage: number; // GB
    collaborators: number;
    exportFormats: string[];
  };
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    stripePriceId: '',
    features: [
      'Basic audio enhancement',
      'Standard quality processing',
      'MP3 & WAV export',
      'Community support'
    ],
    limits: {
      projects: 3,
      aiCredits: 10,
      storage: 1,
      collaborators: 0,
      exportFormats: ['mp3', 'wav']
    }
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 29,
    interval: 'month',
    stripePriceId: 'price_1234567890', // Replace with actual Stripe price ID
    features: [
      'Advanced AI enhancement',
      'All genre styles',
      'Professional mastering',
      'Track separation',
      'Team collaboration',
      'Priority processing',
      'All export formats',
      'Email support'
    ],
    limits: {
      projects: 50,
      aiCredits: 100,
      storage: 25,
      collaborators: 5,
      exportFormats: ['mp3', 'wav', 'flac', 'aiff']
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    interval: 'month',
    stripePriceId: 'price_0987654321', // Replace with actual Stripe price ID
    features: [
      'Everything in Professional',
      'Unlimited projects',
      'Custom AI models',
      'API access',
      'White-label options',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee'
    ],
    limits: {
      projects: -1, // unlimited
      aiCredits: 1000,
      storage: 100,
      collaborators: -1, // unlimited
      exportFormats: ['mp3', 'wav', 'flac', 'aiff', 'dsd', '32bit-float']
    }
  }
];

class StripeService {
  private stripe: Stripe | null = null;
  private publishableKey = 'pk_test_51RMt56RGWfat3YdmILDfetArR6MCRuGbooaRddIRetU4FP450G0HTibA5uzYlVr2kjVPOIKikq74nM9hTE3duwuf00BbTNRtKM';

  async initialize(): Promise<void> {
    try {
      this.stripe = await loadStripe(this.publishableKey);
      if (!this.stripe) {
        throw new Error('Failed to load Stripe');
      }
    } catch (error) {
      console.error('Stripe initialization failed:', error);
      toast.error('Payment system unavailable');
      throw error;
    }
  }

  async createCheckoutSession(priceId: string, userId: string): Promise<void> {
    if (!this.stripe) {
      await this.initialize();
    }

    try {
      // In a real app, this would call your backend API
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const result = await this.stripe!.redirectToCheckout({
        sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Checkout session creation failed:', error);
      toast.error('Failed to start checkout process');
      throw error;
    }
  }

  async createPortalSession(customerId: string): Promise<void> {
    try {
      // In a real app, this would call your backend API
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl: window.location.origin,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Portal session creation failed:', error);
      toast.error('Failed to open billing portal');
      throw error;
    }
  }

  getPlanById(planId: PricingPlan): SubscriptionPlan | undefined {
    return SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }

  // Simulate subscription status check (in real app, this would call your backend)
  async getSubscriptionStatus(userId: string): Promise<{
    plan: PricingPlan;
    status: 'active' | 'canceled' | 'past_due' | 'trialing';
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
  }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      plan: 'pro',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      cancelAtPeriodEnd: false,
    };
  }
}

export const stripeService = new StripeService();