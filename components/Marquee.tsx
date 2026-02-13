import React from 'react';
import { motion } from 'framer-motion';

const Marquee: React.FC = () => {
  const marqueeText = "STRATEGY / DESIGN / DEVELOPMENT / BRANDING / MOTION / UX RESEARCH / ";
  
  return (
    <div className="relative w-full overflow-hidden border-b border-black bg-black py-4">
      <div className="flex whitespace-nowrap">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
        >
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-4xl font-bold uppercase tracking-widest text-white mr-8">
              {marqueeText}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Marquee;