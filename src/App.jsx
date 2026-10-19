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
import { Eye, X, Server } from 'lucide-react';

// Hardcoded directly to avoid any Vite build-time variable injection bugs
const BACKEND_URL = "https://signbridge-backend-9ir2.onrender.com";

export default function App() {
  const getTabFromHash = () => {
    const hash = window.location.hash.replace('#', '').trim();
    const validTabs = ['landing', 'translator', 'conversation', 'history', 'dashboard', 'learn', 'auth'];
    return validTabs.includes(hash) ? hash : 'landing';
  };

  const [activeTab, setActiveTabState] = useState(getTabFromHash());
  const [currentUser, setCurrentUser] = useState(null);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // State to store FastAPI backend connection status
  const [backendStatus, setBackendStatus] = useState({ connected: false, message: 'Connecting...' });

  const setActiveTab = (tabId) => {
    setActiveTabState(tabId);
    if (window.location.hash !== `#${tabId}`) {
      window.history.pushState({ tabId }, '', `#${tabId}`);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const currentTab = getTabFromHash();
      setActiveTabState(currentTab);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  useEffect(() => {
    loadUser();
    checkBackendConnection();
  }, []);

  // Fetch root endpoint from your live FastAPI backend server
  const checkBackendConnection = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/`);
      const data = await response.json();
      setBackendStatus({ connected: true, message: data.message });
    } catch (error) {
      console.error('FastAPI Backend connection failed:', error);
      setBackendStatus({ connected: false, message: 'Backend Offline' });
    }
  };

  const loadUser = async () => {
    const user = await getCurrentUser();
    setCurrentUser(user);
    if (!user) {
      setShowAuthModal(true);
    } else if (user?.highContrast) {
      document.body.classList.add('high-contrast');
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

      {/* Status banner to confirm FastAPI connection */}
      <div className={`px-4 py-1.5 text-xs font-medium text-center flex items-center justify-center gap-2 ${
        backendStatus.connected 
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-b border-emerald-500/20' 
          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-b border-amber-500/20'
      }`}>
        <Server className="w-3.5 h-3.5" />
        <span>FastAPI Status: <strong>{backendStatus.message}</strong></span>
      </div>

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