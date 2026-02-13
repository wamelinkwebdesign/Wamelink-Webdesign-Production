import React from 'react';
import MagneticButton from './MagneticButton';
import { motion } from 'framer-motion';

const CTA: React.FC = () => {
  return (
    <section className="py-24 md:py-40 bg-black text-white overflow-hidden relative">
      {/* Decorative rotating circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 60 }}
          className="absolute -right-32 -top-32 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full border border-white/5"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 45 }}
          className="absolute -left-20 -bottom-20 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full border border-[#FFD700]/10"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFD700]/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-8 text-center relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-8 block"
        >
          Klaar voor de volgende stap?
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-[12vw] md:text-[6vw] leading-[0.9] font-black tracking-tighter uppercase mb-6 md:mb-8"
        >
          Laten we iets<br />
          <span className="text-[#FFD700]">moois</span> maken.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 font-medium mb-12 md:mb-16 max-w-xl mx-auto"
        >
          Vertel me over je project. Ik reageer binnen 24 uur.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full px-2 sm:px-0"
        >
          <MagneticButton
            href="https://calendar.app.google/DZwS3JYfBFnzHn566"
            target="_blank"
            className="bg-[#FFD700] text-black px-8 md:px-12 py-5 md:py-6 rounded-full text-lg md:text-xl font-bold uppercase tracking-widest hover:bg-white transition-colors w-full sm:w-auto flex items-center justify-center border border-[#FFD700] hover:border-white"
          >
            Plan een gesprek
          </MagneticButton>
          <MagneticButton
            href="mailto:dennis@wamelinkwebdesign.nl"
            className="bg-transparent text-white border-2 border-white/30 px-8 md:px-12 py-5 md:py-6 rounded-full text-lg md:text-xl font-bold uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-colors w-full sm:w-auto flex items-center justify-center"
          >
            Stuur een mail
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
