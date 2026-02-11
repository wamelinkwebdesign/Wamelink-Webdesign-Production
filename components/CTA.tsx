import React from 'react';
import MagneticButton from './MagneticButton';
import { motion } from 'framer-motion';

const CTA: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-white border-t border-black overflow-hidden relative">
      <div className="container mx-auto px-4 sm:px-8 text-center">
        
        <motion.h2
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="text-[12vw] md:text-[6vw] leading-[0.9] font-black tracking-tighter uppercase mb-6 md:mb-8"
        >
          Klaar om online<br />
          <span className="text-[#ffcf00] stroke-black text-stroke-mobile md:text-stroke-desktop">Impact</span> te maken?
        </motion.h2>
        <p className="text-lg md:text-xl text-gray-500 font-medium mb-10 md:mb-12 max-w-xl mx-auto">
          Neem vandaag nog contact op voor een vrijblijvend gesprek.
        </p>

        <div className="flex justify-center w-full px-2 sm:px-0">
          <MagneticButton 
            href="mailto:dennis@wamelinkwebdesign.nl"
            className="bg-black text-white px-8 md:px-12 py-5 md:py-6 rounded-full text-lg md:text-xl font-bold uppercase tracking-widest hover:bg-[#ffcf00] hover:text-black transition-colors hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full sm:w-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-none flex items-center justify-center"
          >
            Start Project
          </MagneticButton>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-full -z-10 pointer-events-none opacity-5">
         <div className="w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-black rounded-full blur-[100px] absolute -left-1/4 -bottom-1/2"></div>
         <div className="w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#ffcf00] rounded-full blur-[100px] absolute -right-1/4 -top-1/2"></div>
      </div>
      <style>{`
        .text-stroke-mobile {
          -webkit-text-stroke: 1px black;
        }
        .text-stroke-desktop {
          @media (min-width: 768px) {
            -webkit-text-stroke: 2px black;
          }
        }
      `}</style>
    </section>
  );
};

export default CTA;