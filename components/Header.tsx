import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const expertiseLinks = [
  { name: 'Website laten maken', href: '/website-laten-maken-amsterdam' },
  { name: 'Website redesign', href: '/website-redesign-amsterdam' },
  { name: 'Webshop', href: '/webshop-laten-maken-amsterdam' },
  { name: 'App development', href: '/app-laten-maken-amsterdam' },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expertiseOpen, setExpertiseOpen] = useState(false);
  const [mobileExpertiseOpen, setMobileExpertiseOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setExpertiseOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    { name: 'Expertise', href: '#services', hasDropdown: true },
    { name: 'Work', href: '#work' },
    { name: 'Blog', href: '/blog', isRoute: true },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled && !isOpen ? 'bg-white/90 backdrop-blur-md border-black/10 py-4' : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-8 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-black tracking-tighter uppercase z-50 transition-colors text-black relative"
        >
          Wamelink<span className="hidden sm:inline"> Webdesign</span><span className="text-[#FFD700]">.</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            link.hasDropdown ? (
              <div key={link.name} className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setExpertiseOpen(!expertiseOpen)}
                  className="text-sm font-bold uppercase tracking-widest hover:text-gray-500 transition-colors text-black flex items-center gap-1"
                >
                  {link.name}
                  <ChevronDown
                    size={14}
                    strokeWidth={3}
                    className={`transition-transform duration-200 ${expertiseOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {expertiseOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white border border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden min-w-[220px]"
                    >
                      {expertiseLinks.map((subLink, i) => (
                        <Link
                          key={subLink.name}
                          to={subLink.href}
                          onClick={() => setExpertiseOpen(false)}
                          className={`block px-5 py-3.5 text-sm font-bold tracking-wide hover:bg-[#FFD700] hover:text-black transition-colors ${
                            i !== expertiseLinks.length - 1 ? 'border-b border-black/10' : ''
                          }`}
                        >
                          {subLink.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : link.isRoute ? (
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
              className="fixed inset-0 bg-white z-40 flex flex-col items-center py-24 md:hidden text-black h-[100dvh]"
            >
              <div className="flex-1 flex flex-col items-center justify-center gap-8">
                {/* Expertise with sub-links */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setMobileExpertiseOpen(!mobileExpertiseOpen)}
                    className="text-4xl font-black uppercase tracking-tighter hover:text-gray-500 flex items-center gap-2"
                  >
                    Expertise
                    <ChevronDown
                      size={28}
                      strokeWidth={3}
                      className={`transition-transform duration-200 ${mobileExpertiseOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileExpertiseOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden flex flex-col items-center gap-4 mt-4"
                      >
                        {expertiseLinks.map((subLink) => (
                          <Link
                            key={subLink.name}
                            to={subLink.href}
                            className="text-xl font-bold tracking-tight text-gray-500 hover:text-black transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {subLink.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <a
                  href="#work"
                  className="text-4xl font-black uppercase tracking-tighter hover:text-gray-500"
                  onClick={() => setIsOpen(false)}
                >
                  Work
                </a>
                <Link
                  to="/blog"
                  className="text-4xl font-black uppercase tracking-tighter hover:text-gray-500"
                  onClick={() => setIsOpen(false)}
                >
                  Blog
                </Link>
                <a
                  href="#contact"
                  className="text-4xl font-black uppercase tracking-tighter hover:text-gray-500"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </a>
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
