import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const navLinks = [
    { name: 'Over ons', href: '/website-laten-maken-amsterdam', isRoute: true },
    { name: 'Expertise', href: '#services' },
    { name: 'Work', href: '#work' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled && !isOpen ? 'bg-white/90 backdrop-blur-md border-black/10 py-4' : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-8 flex justify-between items-center">
        <a 
          href="#" 
          className="text-2xl font-black tracking-tighter uppercase z-50 transition-colors text-black relative"
        >
          Wamelink<span className="hidden sm:inline"> Webdesign</span><span className="text-[#FFD700]">.</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            link.isRoute ? (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-bold uppercase tracking-widest hover:text-gray-500 transition-colors text-black"
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-bold uppercase tracking-widest hover:text-gray-500 transition-colors text-black"
              >
                {link.name}
              </a>
            )
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden z-50 text-black relative"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ y: "-100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-between py-24 md:hidden text-black h-[100dvh]"
            >
              <div className="flex flex-col items-center gap-8 mt-12">
                {navLinks.map((link) => (
                  link.isRoute ? (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="text-4xl font-black uppercase tracking-tighter hover:text-gray-500"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      key={link.name}
                      href={link.href}
                      className="text-4xl font-black uppercase tracking-tighter hover:text-gray-500"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </a>
                  )
                ))}
              </div>

              {/* Email Pill */}
              <div className="mb-4">
                 <a 
                    href="mailto:dennis@wamelinkwebdesign.nl"
                    className="bg-[#FFD700] text-black px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all border border-black"
                 >
                    dennis@wamelinkwebdesign.nl
                 </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;