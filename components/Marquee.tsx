import React from 'react';
import { motion } from 'framer-motion';

const Marquee: React.FC = () => {
  const row1 = 'STRATEGY — DESIGN — DEVELOPMENT — BRANDING — MOTION — UX RESEARCH — ';
  const row2 = 'REACT — NEXT.JS — TYPESCRIPT — TAILWIND — FIGMA — FRAMER MOTION — ';

  return (
    <div className="relative w-full overflow-hidden border-b border-black bg-black py-5 select-none">
      {/* Row 1: Left direction */}
      <div className="flex whitespace-nowrap mb-2">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: [0, -1920] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 25 }}
        >
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="text-3xl md:text-4xl font-black uppercase tracking-widest text-white mx-4"
            >
              {row1}
            </span>
          ))}
        </motion.div>
      </div>
      {/* Row 2: Right direction — outline text */}
      <div className="flex whitespace-nowrap">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: [-1920, 0] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 30 }}
        >
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="text-3xl md:text-4xl font-black uppercase tracking-widest mx-4 text-transparent"
              style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}
            >
              {row2}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Marquee;
