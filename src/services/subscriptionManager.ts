export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface SubscriptionLimits {
  maxProjects: number;
  maxFileSize: number; // in MB
  maxProcessingTime: number; // in minutes
  aiCreditsPerMonth: number;
  cloudStorageGB: number;
  collaborators: number;
  exportFormats: string[];
  priorityProcessing: boolean;
  advancedFeatures: string[];
}

export class SubscriptionManager {
  private static limits: Record<SubscriptionTier, SubscriptionLimits> = {
    free: {
      maxProjects: 3,
      maxFileSize: 25,
      maxProcessingTime: 5,
      aiCreditsPerMonth: 10,
      cloudStorageGB: 1,
      collaborators: 0,
      exportFormats: ['mp3', 'wav'],
      priorityProcessing: false,
      advancedFeatures: []
    },
    pro: {
      maxProjects: 50,
      maxFileSize: 100,
      maxProcessingTime: 30,
      aiCreditsPerMonth: 100,
      cloudStorageGB: 25,
      collaborators: 5,
      exportFormats: ['mp3', 'wav', 'flac', 'aiff'],
      priorityProcessing: true,
      advancedFeatures: ['ai-completion', 'advanced-separation', 'dolby-processing']
    },
    enterprise: {
      maxProjects: -1, // unlimited
      maxFileSize: 500,
      maxProcessingTime: -1, // unlimited
      aiCreditsPerMonth: 1000,
      cloudStorageGB: 100,
      collaborators: -1, // unlimited
      exportFormats: ['mp3', 'wav', 'flac', 'aiff', 'dsd', '32bit-float'],
      priorityProcessing: true,
      advancedFeatures: [
        'ai-completion',
        'advanced-separation',
        'dolby-processing',
        'api-access',
        'white-label',
        'custom-models'
      ]
    }
  };

  static getLimits(tier: SubscriptionTier): SubscriptionLimits {
    return this.limits[tier];
  }

  static canPerformAction(
    tier: SubscriptionTier,
    action: string,
    currentUsage: Record<string, number>
  ): { allowed: boolean; reason?: string } {
    const limits = this.getLimits(tier);

    switch (action) {
      case 'create-project':
        if (limits.maxProjects !== -1 && currentUsage.projects >= limits.maxProjects) {
          return { allowed: false, reason: `Maximum projects limit reached (${limits.maxProjects})` };
        }
        break;

      case 'upload-file':
        if (currentUsage.fileSize > limits.maxFileSize) {
          return { allowed: false, reason: `File size exceeds limit (${limits.maxFileSize}MB)` };
        }
        break;

      case 'ai-processing':
        if (currentUsage.aiCredits >= limits.aiCreditsPerMonth) {
          return { allowed: false, reason: 'Monthly AI credits exhausted' };
        }
        break;

      case 'add-collaborator':
        if (limits.collaborators !== -1 && currentUsage.collaborators >= limits.collaborators) {
          return { allowed: false, reason: `Maximum collaborators limit reached (${limits.collaborators})` };
        }
        break;

      default:
        break;
    }

    return { allowed: true };
  }

  static hasFeature(tier: SubscriptionTier, feature: string): boolean {
    const limits = this.getLimits(tier);
    return limits.advancedFeatures.includes(feature);
  }

  static getUpgradeRecommendation(
    currentTier: SubscriptionTier,
    blockedAction: string
  ): { tier: SubscriptionTier; benefits: string[] } {
    if (currentTier === 'free') {
      return {
        tier: 'pro',
        benefits: [
          '50 projects instead of 3',
          '100MB file uploads',
          '100 AI credits per month',
          'Priority processing',
          'Advanced features',
          'Team collaboration'
        ]
      };
    } else if (currentTier === 'pro') {
      return {
        tier: 'enterprise',
        benefits: [
          'Unlimited projects',
          '500MB file uploads',
          '1000 AI credits per month',
          'Unlimited collaborators',
          'API access',
          'White-label options',
          'Custom AI models'
        ]
      };
    }

    return { tier: currentTier, benefits: [] };
  }
}