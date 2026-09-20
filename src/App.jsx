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
import { KeyRound, ShieldCheck } from 'lucide-react';

export default function App() {
  const getTabFromHash = () => {
    const hash = window.location.hash.replace('#', '').trim();
    const validTabs = ['landing', 'translator', 'conversation', 'history', 'dashboard', 'learn', 'auth'];
    return validTabs.includes(hash) ? hash : 'landing';
  };

  const [activeTab, setActiveTabState] = useState(getTabFromHash());
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);

  const setActiveTab = (tabId) => {
    setActiveTabState(tabId);
    if (window.location.hash !== `#${tabId}`) {
      window.history.pushState({ tabId }, '', `#${tabId}`);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setLoadingUser(true);
    const user = await getCurrentUser();
    setCurrentUser(user);
    if (user?.highContrast) {
      document.body.classList.add('high-contrast');
    }
    setLoadingUser(false);
  };

  const handleAuthComplete = (user) => {
    setCurrentUser(user);
    if (user?.highContrast) {
      document.body.classList.add('high-contrast');
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-xs font-semibold">
        <div className="flex items-center gap-3">
          <KeyRound className="w-5 h-5 text-brand-500 animate-spin" />
          <span>Verifying SignBridge AI Session...</span>
        </div>
      </div>
    );
  }

  // Strictly Gate Application Access - Only allow entry AFTER Email OTP Verification
  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col justify-center bg-slate-900 text-slate-100 font-sans p-4 relative overflow-hidden">
        <div className="max-w-md mx-auto w-full z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-950 border border-brand-800 text-brand-300 rounded-full text-xs font-bold mx-auto w-fit">
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            PROTECTED ACCESS • EMAIL OTP REQUIRED
          </div>

          <AuthPage
            currentUser={currentUser}
            setCurrentUser={handleAuthComplete}
          />
        </div>
      </div>
    );
  }

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
    </div>
  );
}
