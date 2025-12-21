import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, ArrowLeft, ArrowUpRight } from 'lucide-react';

const projects = [
  {
    id: '1',
    caseId: '01',
    title: 'collect.fyi',
    description: 'De one-stop shop voor artiesten die hun tourleven willen vereenvoudigen.',
    image: 'https://storage.googleapis.com/wamelinkwebdesign/collectfyi-nobg-s.png', 
    year: '2024'
  },
  {
    id: '2',
    caseId: '02',
    title: 'Personal Excellence',
    description: 'Een toonaangevend coachingbureau dat zich specialiseert in persoonlijke en professionele ontwikkeling.',
    image: 'https://storage.googleapis.com/wamelinkwebdesign/personal-excellence-nobg-s.png',
    year: '2023'
  },
  {
    id: '3',
    caseId: '03',
    title: 'Clayrety',
    description: 'Expert in Himalaya klankschaalsessies.',
    image: 'https://storage.googleapis.com/wamelinkwebdesign/clayrety-2.png',
    year: '2023'
  }
];

const ProjectSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position for parallax
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for movement
  const springConfig = { damping: 50, stiffness: 400, mass: 0.5 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  // Cursor follower spring
  const cursorX = useSpring(0, { damping: 20, stiffness: 300, mass: 0.5 });
  const cursorY = useSpring(0, { damping: 20, stiffness: 300, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      // Normalize coordinates -1 to 1 for parallax
      const normalizeX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const normalizeY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      
      x.set(normalizeX);
      y.set(normalizeY);

      // Cursor position relative to viewport
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  // Parallax transforms
  const laptopX = useTransform(mouseX, [-1, 1], [-20, 20]);
  const laptopY = useTransform(mouseY, [-1, 1], [-20, 20]);
  const phoneX = useTransform(mouseX, [-1, 1], [-40, 40]);
  const phoneY = useTransform(mouseY, [-1, 1], [-40, 40]);
  const contentX = useTransform(mouseX, [-1, 1], [-10, 10]);

  return (
    <section 
      id="work" 
      ref={containerRef}
      className="relative min-h-screen bg-[#FFD700] overflow-hidden flex items-center py-24"
      onMouseMove={handleMouseMove}
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[50%] h-full opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
           <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
             <circle cx="1" cy="1" r="1" fill="black" />
           </pattern>
           <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* Custom Cursor for Case View */}
      <motion.div
        className="fixed top-0 left-0 w-32 h-32 bg-white rounded-full flex items-center justify-center pointer-events-none z-[100] mix-blend-difference"
        style={{ 
          x: cursorX, 
          y: cursorY, 
          translateX: '-50%', 
          translateY: '-50%' 
        }}
        animate={{ 
          scale: isHovering ? 1 : 0,
          opacity: isHovering ? 1 : 0
        }}
      >
        <span className="text-black font-black text-sm tracking-widest">CASE BEKIJKEN</span>
      </motion.div>

      <div className="container mx-auto px-4 sm:px-8 relative z-10 w-full h-full">
        <div className="flex flex-col lg:flex-row items-center h-full">
          
          {/* Text Section (Left / Top) */}
          <div className="w-full lg:w-1/2 relative z-20 pointer-events-none lg:pointer-events-auto mb-12 lg:mb-0">
             <AnimatePresence mode="wait">
               <motion.div
                 key={currentIndex}
                 initial={{ opacity: 0, y: 50 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -50 }}
                 transition={{ duration: 0.5, ease: "easeInOut" }}
                 className="flex flex-col gap-6"
               >
                 <div className="flex items-center gap-4 text-black/60">
                   <span className="text-sm font-bold tracking-widest uppercase border border-black/20 px-3 py-1 rounded-full">
                     Case {projects[currentIndex].caseId}
                   </span>
                   <span className="text-sm font-mono">{projects[currentIndex].year}</span>
                 </div>
                 
                 <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-black mix-blend-multiply max-w-xl">
                   {projects[currentIndex].title}
                 </h2>
                 
                 <p className="text-xl md:text-2xl font-medium text-black/80 max-w-md leading-relaxed">
                   {projects[currentIndex].description}
                 </p>

                 <div className="pt-8 flex gap-4 pointer-events-auto">
                   <button 
                     onClick={prevSlide}
                     className="w-14 h-14 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-[#FFD700] transition-all"
                   >
                     <ArrowLeft size={24} />
                   </button>
                   <button 
                     onClick={nextSlide}
                     className="w-14 h-14 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-[#FFD700] transition-all"
                   >
                     <ArrowRight size={24} />
                   </button>
                 </div>
               </motion.div>
             </AnimatePresence>
          </div>

          {/* Image Section (Right / Bottom) - Parallax */}
          <div 
            className="w-full lg:w-1/2 relative h-[50vh] md:h-[70vh] flex items-center justify-center lg:translate-x-12"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="relative w-full max-w-2xl aspect-[4/3] cursor-none"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                {/* Layer 1: Laptop Back (Simulated) */}
                <motion.div 
                  style={{ x: laptopX, y: laptopY }}
                  className="absolute inset-0 bg-black rounded-3xl transform translate-x-8 translate-y-8 opacity-20 blur-2xl" 
                />
                
                {/* Layer 2: Main Image (Laptop Front) */}
                <motion.div 
                  style={{ x: contentX, y: contentX }}
                  className="absolute inset-0 z-10 overflow-hidden rounded-2xl shadow-2xl border-4 border-black bg-white"
                >
                  <img 
                    src={projects[currentIndex].image} 
                    alt="Laptop View" 
                    className="w-full h-full object-contain p-8 scale-110"
                  />
                  {/* Glare effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                </motion.div>

                {/* Layer 3: Phone (Floating in front) */}
                <motion.div
                  style={{ x: phoneX, y: phoneY }}
                  className="absolute -bottom-10 -right-4 md:-right-12 z-20 w-[120px] md:w-[160px] aspect-[9/19] bg-black rounded-[2rem] border-[6px] border-black shadow-2xl overflow-hidden"
                >
                   {/* Phone Screen Content - Crop of same image or related */}
                   <div className="w-full h-full bg-white relative">
                      <img 
                        src={projects[currentIndex].image} 
                        alt="Mobile View" 
                        className="w-full h-full object-cover"
                      />
                      {/* Status Bar Decor */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-black rounded-full" />
                   </div>
                </motion.div>

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectSlider;