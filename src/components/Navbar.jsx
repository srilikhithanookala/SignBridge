import React, { useState } from 'react';
import { Camera, MessageSquare, History, LayoutDashboard, BookOpen, User, Eye, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentUser, onOpenAccessibility }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Sparkles },
    { id: 'translator', label: 'Translator', icon: Camera },
    { id: 'conversation', label: 'Conversation', icon: MessageSquare },
    { id: 'history', label: 'History', icon: History },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'learn', label: 'Learn Signs', icon: BookOpen },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div 
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-purpleBrand-600 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
              <span className="text-xl">🤟</span>
            </div>
            <div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-purpleBrand-600">
                SignBridge AI
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenAccessibility}
              className="p-2 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Open Accessibility Settings"
            >
              <Eye className="w-5 h-5 text-brand-600" />
            </button>

            <button
              onClick={() => handleNavClick('auth')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition ${
                activeTab === 'auth'
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-slate-800 text-brand-600 flex items-center justify-center font-bold text-[10px]">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
              <span className="max-w-[100px] truncate">{currentUser?.name || 'Account'}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
