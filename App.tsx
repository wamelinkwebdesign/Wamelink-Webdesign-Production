import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Header from './components/Header';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Services from './components/Services';
import ProjectShowcase from './components/ProjectShowcase';
import CTA from './components/CTA';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import Terms from './components/Terms';
import PrivacyPolicy from './components/PrivacyPolicy';
import WebsiteLatenMakenAmsterdam from './components/WebsiteLatenMakenAmsterdam';
import WebdesignAmsterdam from './components/WebdesignAmsterdam';
import AppLatenMakenAmsterdam from './components/AppLatenMakenAmsterdam';
import SalesOutreach from './components/sales/SalesOutreach';
import Lenis from 'lenis';
import { AnimatePresence, motion } from 'framer-motion';

const SALES_PIN = 'wamelink2024';

const HomePage: React.FC = () => (
  <motion.div
    key="home"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <Header />
    <main>
      <Hero />
      <Marquee />
      <Services />
      <ProjectShowcase />
      <CTA />
    </main>
    <Footer />
  </motion.div>
);

const App: React.FC = () => {
  const [showSales, setShowSales] = useState(false);
  const [salesAuthenticated, setSalesAuthenticated] = useState(false);
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const location = useLocation();

  const attemptSalesAccess = () => {
    if (salesAuthenticated || sessionStorage.getItem('sales_auth') === '1') {
      setSalesAuthenticated(true);
      setShowSales(true);
    } else {
      setShowPinPrompt(true);
      setPinInput('');
      setPinError(false);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === SALES_PIN) {
      setSalesAuthenticated(true);
      sessionStorage.setItem('sales_auth', '1');
      setShowPinPrompt(false);
      setShowSales(true);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  // Hidden keyboard shortcut to access sales dashboard (Ctrl+Shift+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        attemptSalesAccess();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [salesAuthenticated]);

  // Check URL hash or path for admin dashboard access (not indexable by Google)
  useEffect(() => {
    if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
      attemptSalesAccess();
    }
  }, [location]);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Show sales dashboard overlay if authenticated
  if (showSales) {
    return (
      <div className="antialiased text-black bg-white selection:bg-[#ffcf00] selection:text-black">
        <SalesOutreach onClose={() => setShowSales(false)} />
      </div>
    );
  }

  return (
    <div className="antialiased text-black bg-white selection:bg-[#ffcf00] selection:text-black">
      <CustomCursor />

      <AnimatePresence mode="wait">
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/website-laten-maken-amsterdam" element={<WebsiteLatenMakenAmsterdam />} />
          <Route path="/webdesign-amsterdam" element={<WebdesignAmsterdam />} />
          <Route path="/app-laten-maken-amsterdam" element={<AppLatenMakenAmsterdam />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </AnimatePresence>

      {/* PIN Prompt for Sales Dashboard */}
      <AnimatePresence>
        {showPinPrompt && (
          <motion.div
            key="pin-prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowPinPrompt(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <h2 className="text-lg font-black uppercase tracking-tight mb-1">Sales Dashboard</h2>
              <p className="text-sm text-gray-500 mb-6">Voer de pincode in om toegang te krijgen.</p>
              <form onSubmit={handlePinSubmit}>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
                  className={`w-full px-4 py-3 border rounded-lg text-sm font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-[#FFD700] ${
                    pinError ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                  placeholder="Pincode"
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs text-red-500 mt-2 text-center font-bold">Onjuiste pincode</p>
                )}
                <button
                  type="submit"
                  className="w-full mt-4 bg-black text-white py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
                >
                  Toegang
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Analytics />
    </div>
  );
};

export default App;
