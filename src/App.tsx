/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useTravelStore } from './store/travelStore';
import Dashboard from './components/Dashboard';
import GisMap from './components/GisMap';
import RecommendationForm from './components/RecommendationForm';
import ItineraryPlanner from './components/ItineraryPlanner';
import CultureSection from './components/CultureSection';
import CulinarySection from './components/CulinarySection';
import ChatPanel from './components/ChatPanel';
import { Compass, Sparkles, Map, Calendar, BookOpen, Coffee, Bot, Award, Menu, X, Landmark, Globe } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { activeTab, setActiveTab, initAuth, user } = useTravelStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFloatingChat, setShowFloatingChat] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  // Initialize Auth on startup
  useEffect(() => {
    initAuth();
  }, []); // Empty array is safe as initAuth is stabilized in Zustand

  // Helper to render the active tab content
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'map':
        return <GisMap />;
      case 'recommendation':
        return <RecommendationForm />;
      case 'planner':
        return <ItineraryPlanner />;
      case 'culture':
        return <CultureSection />;
      case 'culinary':
        return <CulinarySection />;
      case 'chat':
        return <ChatPanel />;
      default:
        return <Dashboard />;
    }
  };

  const navItems = [
    { id: 'dashboard' as const, label: t('nav.home'), icon: Landmark },
    { id: 'map' as const, label: t('nav.map'), icon: Map },
    { id: 'recommendation' as const, label: t('nav.recommendation'), icon: Sparkles },
    { id: 'planner' as const, label: t('nav.planner'), icon: Calendar },
    { id: 'culture' as const, label: t('nav.culture'), icon: BookOpen },
    { id: 'culinary' as const, label: t('nav.culinary'), icon: Coffee },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F2FE] via-[#ECFDF5] to-[#FEF3C7] relative overflow-x-hidden flex flex-col font-sans selection:bg-[#0EA5E9] selection:text-white">
      
      {/* LUXURIOUS LAKE TOBA AMBIENT REDESIGNED BACKGROUND */}
      <div className="absolute top-0 inset-x-0 h-[800px] bg-gradient-to-b from-[#0EA5E9]/15 via-[#10B981]/10 to-transparent pointer-events-none -z-20" />
      
      {/* Animated Gradient Blob 1 - Crystal Blue Lake */}
      <div className="absolute top-[-150px] right-[-100px] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#0EA5E9]/25 to-[#3B82F6]/20 blur-[120px] pointer-events-none -z-10 animate-float-slow" />
      
      {/* Animated Gradient Blob 2 - Morning Mist & Green Mountains */}
      <div className="absolute top-[300px] left-[-200px] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-[#10B981]/20 via-[#F59E0B]/15 to-transparent blur-[130px] pointer-events-none -z-10 animate-float-reverse" />
      
      {/* Animated Gradient Blob 3 - Violet Sunset Reflection */}
      <div className="absolute bottom-[200px] right-[-50px] w-[650px] h-[650px] rounded-full bg-gradient-to-l from-[#D946EF]/18 to-[#0EA5E9]/15 blur-[110px] pointer-events-none -z-10 animate-float-slow" />

      {/* Abstract Topographic & Mist Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,transparent_80%)] pointer-events-none -z-10" />
      <div className="absolute top-36 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#0EA5E9]/10 to-transparent pointer-events-none -z-10" />
      
      {/* GLOBAL FLOATING GLASSMORPHIC HEADER */}
      <header className="sticky top-0 z-50 w-full px-4 pt-4 pb-2 transition-all print:hidden">
        <div className="max-w-7xl mx-auto bg-white/70 backdrop-blur-md border border-[#E0F2FE]/55 rounded-2xl shadow-sm px-4 md:px-6 h-16 flex items-center justify-between">
          
          {/* BRAND LOGO */}
          <button 
            onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0F4C81] to-[#0EA5E9] flex items-center justify-center shadow-md shadow-[#0EA5E9]/20 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
              <Compass className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            <div>
              <h1 className="font-display font-bold text-sm tracking-widest text-[#0F172A]">TOBA INFINITY</h1>
              <p className="text-[9px] font-mono tracking-wider text-[#64748B]">{t('brand.sub')}</p>
            </div>
          </button>

          {/* DESKTOP NAVIGATION LINKS WITH SMOOTH ACTIVE INDICATOR */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'text-[#0F4C81]'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-[#E0F2FE]/60 rounded-xl -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0EA5E9]' : 'text-[#64748B] group-hover:text-[#0F172A]'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* ASISTEN AI & LANGUAGE & USER PROFILE */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* STATE-MANAGED LANGUAGE SWITCHER TOGGLE */}
            <div className="flex items-center bg-slate-100/80 border border-[#E0F2FE]/50 rounded-xl p-0.5 gap-0.5 shrink-0">
              <button
                onClick={() => setLanguage('id')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  language === 'id' 
                    ? 'bg-white text-[#0F172A] shadow-xs' 
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
                title="Bahasa Indonesia"
              >
                <span>ID</span>
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  language === 'en' 
                    ? 'bg-white text-[#0F172A] shadow-xs' 
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
                title="English"
              >
                <span>EN</span>
              </button>
            </div>

            {/* HIGHLIGHTED GLOWING AI ASSISTANT BUTTON */}
            <button
              onClick={() => setActiveTab('chat')}
              className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-sm overflow-hidden ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-[#0F4C81] to-[#0EA5E9] text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-800'
              }`}
            >
              <Bot className="w-4 h-4 text-sky-400 animate-pulse shrink-0" />
              <span>{t('button.ask_ai')}</span>
              {activeTab !== 'chat' && (
                <span className="absolute -inset-1.5 bg-gradient-to-r from-[#0F4C81] to-[#0EA5E9] opacity-20 blur-sm animate-pulse -z-10" />
              )}
            </button>
          </div>

          {/* MOBILE CONTROLS (LANGUAGE & DRAWER) */}
          <div className="lg:hidden flex items-center gap-2">
            {/* MOBILE QUICK LANG TOGGLE */}
            <div className="flex items-center bg-slate-100 border border-slate-200/60 rounded-xl p-0.5 gap-0.5">
              <button
                onClick={() => setLanguage('id')}
                className={`px-2 py-1 rounded text-[9px] font-bold transition-all cursor-pointer ${
                  language === 'id' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                ID
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded text-[9px] font-bold transition-all cursor-pointer ${
                  language === 'en' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#0F172A] hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE FULLSCREEN NAVIDRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/50 z-40 fixed inset-x-0 top-20 bottom-0 overflow-y-auto flex flex-col justify-between p-4 shadow-2xl animate-fade-in">
          <div className="p-2 space-y-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive ? 'bg-gradient-to-r from-[#0F4C81] to-[#0EA5E9] text-white shadow-lg shadow-[#0EA5E9]/10' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
            
            <button
              onClick={() => {
                setActiveTab('chat');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold"
            >
              <Bot className="w-4 h-4 text-sky-400" />
              {t('button.ask_ai')}
            </button>
          </div>
        </div>
      )}

      {/* MAIN VIEWPORT BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderContent()}
      </main>

      {/* FLOATING CHAT BALLOON (FOR QUICK AI CONTEXT LAUNCHER) WITH GLOWING RING */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden">
        <AnimatePresence>
          {showFloatingChat ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="w-[360px] md:w-[400px] h-[550px] rounded-3xl overflow-hidden border border-slate-200/60 shadow-2xl flex flex-col bg-white"
            >
              <div className="bg-gradient-to-r from-[#0F4C81] to-[#0EA5E9] p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0EA5E9] flex items-center justify-center shadow-md">
                    <Bot className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">{t('chat.welcome')}</span>
                    <span className="text-[9px] text-sky-200 font-mono tracking-wider">ONLINE • CALDERA RAG</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowFloatingChat(false)}
                  className="text-xs bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-xl text-white font-semibold"
                >
                  {t('button.close')}
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatPanel />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="relative group"
            >
              {/* Outer pulsing gradient rings */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#0EA5E9] to-[#2563EB] rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />
              <button
                onClick={() => setShowFloatingChat(true)}
                className="relative w-14 h-14 rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-2xl flex items-center justify-center hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                <Bot className="w-6 h-6 text-sky-400 group-hover:rotate-12 transition-transform duration-300" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SYSTEM ARCHITECTURE CREDITS AND UNESCO FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-8 px-4 border-t border-slate-900 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="space-y-1">
            <p className="text-sm font-display font-bold text-white tracking-widest">TOBA INFINITY</p>
            <p className="text-[10px] text-slate-500 font-mono">{t('footer.description')}</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl max-w-md">
            <Award className="w-5 h-5 text-amber-500 fill-amber-500 shrink-0" />
            <p className="text-[10px] text-slate-300 leading-tight">
              {t('footer.credit')}
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

