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
import { Eye, Heart, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const user = await getCurrentUser();
    setCurrentUser(user);
    if (user?.highContrast) {
      document.body.classList.add('high-contrast');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
      />

      {/* Main Container View */}
      <main className="flex-1">
        {activeTab === 'landing' && <LandingPage onNavigate={setActiveTab} />}
        {activeTab === 'translator' && <LiveTranslatorPage currentUser={currentUser} />}
        {activeTab === 'conversation' && <ConversationPage currentUser={currentUser} />}
        {activeTab === 'history' && <HistoryPage currentUser={currentUser} />}
        {activeTab === 'dashboard' && <DashboardPage onNavigate={setActiveTab} />}
        {activeTab === 'learn' && <LearnSignsPage />}
        {activeTab === 'auth' && <AuthPage currentUser={currentUser} setCurrentUser={setCurrentUser} />}
      </main>

      {/* Accessibility Panel Modal */}
      <AccessibilityPanel
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
        currentUser={currentUser}
        onUserUpdate={setCurrentUser}
      />

      {/* Modern Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-semibold">
            <span className="text-base">🤟</span>
            <span className="text-slate-800 dark:text-white font-bold">SignBridge AI</span>
            <span>– Empowering universal human communication</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAccessibilityOpen(true)}
              className="flex items-center gap-1 hover:text-brand-600 font-semibold"
            >
              <Eye className="w-4 h-4 text-brand-600" /> Accessibility Options
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('learn')} className="hover:underline font-medium">Dictionary</button>
            <span>•</span>
            <button onClick={() => setActiveTab('auth')} className="hover:underline font-medium">Account</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
