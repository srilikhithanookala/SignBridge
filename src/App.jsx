import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AccessibilityPanel from './components/AccessibilityPanel';
import LandingPage from './pages/LandingPage';
import LiveTranslatorPage from './pages/LiveTranslatorPage';
import ConversationPage from './pages/ConversationPage';
import HistoryPage from './pages/HistoryPage';
import DashboardPage from './pages/DashboardPage';
import LearnSignsPage from './pages/LearnSignsPage';
import AuthPage from './pages/AuthPage';
import { getCurrentUser } from './services/supabaseClient';
import { Eye, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const user = await getCurrentUser();
    setCurrentUser(user);
    if (!user) {
      setShowAuthModal(true);
    }
  };

  const handleAuthComplete = (user) => {
    setCurrentUser(user);
    setShowAuthModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
      />

      <main className="flex-1">
        {activeTab === 'landing' && <LandingPage onNavigate={setActiveTab} />}
        {activeTab === 'translator' && <LiveTranslatorPage currentUser={currentUser} />}
        {activeTab === 'conversation' && <ConversationPage currentUser={currentUser} />}
        {activeTab === 'history' && <HistoryPage currentUser={currentUser} />}
        {activeTab === 'dashboard' && <DashboardPage onNavigate={setActiveTab} />}
        {activeTab === 'learn' && <LearnSignsPage />}
        {activeTab === 'auth' && <AuthPage currentUser={currentUser} setCurrentUser={handleAuthComplete} />}
      </main>

      {showAuthModal && !currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <AuthPage
              currentUser={currentUser}
              setCurrentUser={handleAuthComplete}
              isModal={true}
              onCloseModal={() => setShowAuthModal(false)}
            />
          </div>
        </div>
      )}

      <AccessibilityPanel
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
        currentUser={currentUser}
        onUserUpdate={setCurrentUser}
      />
    </div>
  );
}
