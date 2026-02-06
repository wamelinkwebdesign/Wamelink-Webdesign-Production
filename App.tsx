import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import SalesOutreach from './components/sales/SalesOutreach';
import Lenis from 'lenis';
import { AnimatePresence, motion } from 'framer-motion';

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
  const location = useLocation();

  // Hidden keyboard shortcut to access sales dashboard (Ctrl+Shift+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        setShowSales(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Check URL hash or path for sales dashboard access
  useEffect(() => {
    if (window.location.hash === '#sales' || window.location.pathname === '/sales') {
      setShowSales(true);
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

  // Show sales dashboard overlay if active
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
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/sales" element={<SalesOutreach onClose={() => window.location.href = '/'} />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default App;
