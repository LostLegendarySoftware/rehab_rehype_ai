import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
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
import { useAudioStore } from './store/audioStore';

function App() {
  const [activeTab, setActiveTab] = useState('enhance');
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { setUser } = useAudioStore();

  // Initialize demo user
  useEffect(() => {
    setUser({
      id: 'demo-user-1',
      email: 'demo@rehabrehype.com',
      subscription: 'pro',
      credits: 85
    });
  }, [setUser]);

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
          onInvite={(email, role) => console.log('Invite:', email, role)}
          onRemove={(id) => console.log('Remove:', id)}
          onRoleChange={(id, role) => console.log('Role change:', id, role)}
        />
      );
    }

    switch (activeTab) {
      case 'enhance':
        return <EnhanceTab />;
      case 'chat':
        return <ChatTab />;
      case 'record':
        return <RecordTab />;
      case 'separate':
        return <SeparateTab />;
      case 'master':
        return <MasterTab />;
      case 'export':
        return <ExportTab />;
      default:
        return <EnhanceTab />;
    }
  };

  return (
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
  );
}

export default App;