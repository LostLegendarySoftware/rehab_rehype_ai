import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import EnhanceTab from './components/EnhanceTab';
import ChatTab from './components/ChatTab';
import RecordTab from './components/RecordTab';
import SeparateTab from './components/SeparateTab';
import MasterTab from './components/MasterTab';
import ExportTab from './components/ExportTab';
import CollaborationPanel from './components/CollaborationPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import UpgradePrompt from './components/UpgradePrompt';
import { useAudioStore } from './store/audioStore';
import { SubscriptionManager } from './services/subscriptionManager';
import { stripeService } from './services/stripeService';

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51RMt56RGWfat3YdmILDfetArR6MCRuGbooaRddIRetU4FP450G0HTibA5uzYlVr2kjVPOIKikq74nM9hTE3duwuf00BbTNRtKM');

function App() {
  const [activeTab, setActiveTab] = useState('enhance');
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [upgradePrompt, setUpgradePrompt] = useState<{
    isOpen: boolean;
    feature: string;
    requiredPlan: 'pro' | 'enterprise';
  }>({ isOpen: false, feature: '', requiredPlan: 'pro' });
  
  const { setUser, user } = useAudioStore();

  // Initialize demo user and Stripe
  useEffect(() => {
    setUser({
      id: 'demo-user-1',
      email: 'demo@rehabrehype.com',
      subscription: 'free', // Start with free plan
      credits: 5 // Limited credits for free plan
    });

    // Initialize Stripe service
    stripeService.initialize().catch(console.error);
  }, [setUser]);

  // Check if user can perform action
  const checkSubscriptionLimit = (action: string, additionalData?: any) => {
    if (!user) return false;

    const currentUsage = {
      projects: 2, // Demo usage
      fileSize: additionalData?.fileSize || 0,
      aiCredits: user.credits,
      collaborators: 1
    };

    const result = SubscriptionManager.canPerformAction(user.subscription, action, currentUsage);
    
    if (!result.allowed) {
      const recommendation = SubscriptionManager.getUpgradeRecommendation(user.subscription, action);
      setUpgradePrompt({
        isOpen: true,
        feature: action,
        requiredPlan: recommendation.tier
      });
      return false;
    }
    
    return true;
  };

  const handleUpgradeFromPrompt = () => {
    setUpgradePrompt({ ...upgradePrompt, isOpen: false });
    // This would typically open the pricing modal
    // For now, we'll just simulate an upgrade
    if (user) {
      setUser({ 
        ...user, 
        subscription: upgradePrompt.requiredPlan,
        credits: upgradePrompt.requiredPlan === 'pro' ? 100 : 1000
      });
    }
  };

  const renderActiveTab = () => {
    if (showAnalytics) {
      return (
        <AnalyticsPanel
          data={{
            totalProjects: 127,
            totalProcessingTime: 342.5,
            averageQualityImprovement: 87,
            popularGenres: [
              { name: 'Hip-Hop/Rap', count: 45, percentage: 35 },
              { name: 'Pop', count: 32, percentage: 25 },
              { name: 'Rock', count: 25, percentage: 20 },
              { name: 'Electronic', count: 15, percentage: 12 },
              { name: 'R&B', count: 10, percentage: 8 }
            ],
            monthlyUsage: [
              { month: 'Jan', projects: 15, hours: 42 },
              { month: 'Feb', projects: 22, hours: 58 },
              { month: 'Mar', projects: 28, hours: 73 },
              { month: 'Apr', projects: 35, hours: 89 },
              { month: 'May', projects: 27, hours: 81 }
            ],
            userSatisfaction: 4.8,
            exportStats: [
              { format: 'WAV', count: 89 },
              { format: 'MP3', count: 156 },
              { format: 'FLAC', count: 34 },
              { format: 'AIFF', count: 12 }
            ]
          }}
        />
      );
    }

    if (showCollaboration) {
      return (
        <CollaborationPanel
          projectId="demo-project-1"
          collaborators={[
            {
              id: '1',
              email: 'sarah@example.com',
              name: 'Sarah Johnson',
              role: 'owner',
              lastActive: new Date(),
              isOnline: true
            },
            {
              id: '2',
              email: 'mike@example.com',
              name: 'Mike Chen',
              role: 'editor',
              lastActive: new Date(Date.now() - 300000),
              isOnline: false
            },
            {
              id: '3',
              email: 'alex@example.com',
              name: 'Alex Rivera',
              role: 'viewer',
              lastActive: new Date(Date.now() - 3600000),
              isOnline: true
            }
          ]}
          onInvite={(email, role) => {
            if (!checkSubscriptionLimit('add-collaborator')) return;
            console.log('Invite:', email, role);
          }}
          onRemove={(id) => console.log('Remove:', id)}
          onRoleChange={(id, role) => console.log('Role change:', id, role)}
        />
      );
    }

    // Pass subscription check function to tabs that need it
    const tabProps = { checkSubscriptionLimit };

    switch (activeTab) {
      case 'enhance':
        return <EnhanceTab {...tabProps} />;
      case 'chat':
        return <ChatTab {...tabProps} />;
      case 'record':
        return <RecordTab {...tabProps} />;
      case 'separate':
        return <SeparateTab {...tabProps} />;
      case 'master':
        return <MasterTab {...tabProps} />;
      case 'export':
        return <ExportTab {...tabProps} />;
      default:
        return <EnhanceTab {...tabProps} />;
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Header />
        <TabNavigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          showCollaboration={showCollaboration}
          setShowCollaboration={setShowCollaboration}
          showAnalytics={showAnalytics}
          setShowAnalytics={setShowAnalytics}
        />
        <main className="container mx-auto max-w-7xl">
          {renderActiveTab()}
        </main>
        
        <UpgradePrompt
          isOpen={upgradePrompt.isOpen}
          onClose={() => setUpgradePrompt({ ...upgradePrompt, isOpen: false })}
          onUpgrade={handleUpgradeFromPrompt}
          feature={upgradePrompt.feature}
          currentPlan={user?.subscription || 'free'}
          requiredPlan={upgradePrompt.requiredPlan}
        />
        
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151'
            }
          }}
        />
      </div>
    </Elements>
  );
}

export default App;