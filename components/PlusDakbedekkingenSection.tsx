import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, Star, Menu, ShieldCheck, ChevronRight } from 'lucide-react';

const PlusDakbedekkingenSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <section className="py-24 bg-white border-b border-black overflow-hidden relative min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="mb-16 md:mb-24 text-center">
             <h2 className="text-[12vw] md:text-[6vw] leading-[0.8] font-black tracking-tighter uppercase text-black mb-4">
               Featured<br/>
               <span className="text-transparent" style={{ WebkitTextStroke: '1px black' }}>Case Study</span>
             </h2>
        </div>

        {/* The Interactive Card */}
        <div className="flex justify-center">
          <CaseCard 
            isOpen={isOpen} 
            onClick={() => setIsOpen(true)} 
          />
        </div>

      </div>

      {/* The Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] cursor-pointer"
            />
            <div className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none p-4 md:p-8">
              <CaseCard 
                isOpen={true} 
                isModal={true} 
                onClick={(e) => e.stopPropagation()} 
                onClose={() => setIsOpen(false)}
              />
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

interface CaseCardProps {
  isOpen: boolean;
  isModal?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onClose?: () => void;
}

const CaseCard: React.FC<CaseCardProps> = ({ isOpen, isModal = false, onClick, onClose }) => {
  // If this is the card in the list and the modal is open, we hide it to prevent duplication
  if (!isModal && isOpen) {
    return <div className="w-full max-w-5xl aspect-[4/5] md:aspect-[16/9] opacity-0 pointer-events-none" />; 
  }

  return (
    <motion.div
      layoutId="card-container"
      onClick={onClick}
      data-lenis-prevent={isModal}
      className={`
        relative w-full max-w-5xl bg-[#F75C2F] rounded-[2rem] md:rounded-[3rem] overflow-hidden text-white shadow-2xl cursor-pointer
        ${isModal ? 'h-[85vh] md:h-auto md:aspect-auto overflow-y-auto md:overflow-hidden pointer-events-auto' : 'aspect-[4/5] md:aspect-[16/9] hover:scale-[1.02] transition-transform duration-500'}
      `}
    >
      <div className="flex flex-col h-full p-8 md:p-16 relative">
        
        {/* --- Header --- */}
        <div className="absolute top-8 left-8 right-8 md:top-16 md:left-16 md:right-16 flex justify-between items-start z-30 pointer-events-none">
          <motion.div layoutId="card-meta" className="flex items-center gap-2 md:gap-4 pointer-events-auto">
            <span className="border border-white/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-black/10 backdrop-blur-sm">
              Case 01
            </span>
            <span className="text-xs font-bold tracking-widest opacity-80">2025</span>
          </motion.div>

          {/* Close Button (Modal) or Arrow (Card) */}
          <motion.div layoutId="card-action" className="pointer-events-auto">
            {isModal ? (
               <button 
                 onClick={(e) => { e.stopPropagation(); onClose?.(); }}
                 className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors"
               >
                 <X size={24} />
               </button>
            ) : (
               <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center">
                 <ArrowUpRight size={24} className="group-hover:rotate-45 transition-transform duration-300" />
               </div>
            )}
          </motion.div>
        </div>

        {/* --- Title Removed --- */}
        
        {/* Spacer to push content down if needed, but flex-col handles it nicely if we just center or fill */}
        <div className={`flex-1 min-h-0 ${isModal ? 'py-16' : ''}`}></div>

        {/* --- Browser Mockup Content --- */}
        <motion.div 
          layoutId="card-content"
          className={`relative w-full rounded-xl md:rounded-2xl overflow-hidden bg-[#111] shadow-2xl ring-1 ring-white/10 ${isModal ? 'aspect-[4/5] md:aspect-[16/9]' : 'h-[65%] md:h-[70%]'}`}
        >
           {/* Fake Browser Toolbar */}
           <div className="absolute top-0 left-0 w-full h-8 bg-[#1a1a1a] flex items-center px-4 gap-2 z-30 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-black/50 px-3 py-0.5 rounded text-[10px] text-gray-500 font-mono flex items-center gap-1">
                   <ShieldCheck size={8} /> plusdakbedekkingen.nl
                </div>
              </div>
           </div>

           {/* Inner Website Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 h-full pt-8">
              
              {/* Left Column: Website Content (Dark Mode) */}
              <div className="p-6 md:p-8 flex flex-col justify-between h-full relative z-10 bg-[#111]">
                 {/* Nav Mockup */}
                 <div className="flex justify-between items-center mb-8 opacity-60">
                    <span className="font-bold text-lg tracking-tighter">PLUS.</span>
                    <Menu size={20} />
                 </div>

                 {/* Hero Content */}
                 <div className="space-y-6">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} size={12} fill="#F75C2F" className="text-[#F75C2F]" />
                      ))}
                      <span className="text-[10px] text-gray-400 ml-2">5.0 uit 120 reviews</span>
                    </div>
                    
                    <h4 className="text-2xl md:text-3xl font-bold leading-tight">
                       Betrouwbare dakspecialist voor elke klus.
                    </h4>
                    
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                       Van lekkage tot complete renovatie. Wij leveren vakwerk met 10 jaar garantie.
                    </p>

                    <button className="bg-[#F75C2F] text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-white hover:text-[#F75C2F] transition-colors w-fit">
                       Offerte aanvragen <ChevronRight size={14} />
                    </button>
                 </div>

                 {/* Footer Mockup */}
                 <div className="mt-8 pt-8 border-t border-white/10 flex gap-4 overflow-hidden opacity-40">
                    <div className="h-12 w-24 bg-white/10 rounded animate-pulse" />
                    <div className="h-12 w-24 bg-white/10 rounded animate-pulse delay-75" />
                 </div>
              </div>

              {/* Right Column: High Quality Image */}
              <div className="h-48 md:h-full relative overflow-hidden bg-gray-800">
                 <img 
                   src="https://storage.googleapis.com/wamelinkwebdesign/plusdak.png"
                   alt="Plus Dakbedekkingen Website"
                   className="absolute inset-0 w-full h-full object-cover md:object-left"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#111] via-transparent to-transparent opacity-80" />
              </div>

           </div>
        </motion.div>

        {/* --- Footer (Details) --- */}
        <motion.div layoutId="card-footer" className="mt-6 md:mt-8 flex justify-end relative z-20 shrink-0">
          <div className="flex gap-2">
            {['Development', 'Branding'].map((tag) => (
              <span key={tag} className="px-3 py-1.5 border border-white/30 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider backdrop-blur-sm bg-black/5">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default PlusDakbedekkingenSection;