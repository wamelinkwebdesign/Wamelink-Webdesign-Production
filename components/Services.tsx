import React from 'react';
import { motion, Variants } from 'framer-motion';
import { PenTool, Code, Plus, Smartphone } from 'lucide-react';

const Services: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 40
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1], // Custom "Swiss" easing
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section id="services" className="py-24 border-b border-black bg-white">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-4">
             <motion.div
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true, amount: 0.5 }}
               transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
               className="sticky top-32"
             >
               <h2 className="text-6xl font-black tracking-tighter uppercase mb-8">Expertise</h2>
               <p className="text-xl font-medium text-gray-500 max-w-sm leading-relaxed">
                  Geen templates. Geen half werk. <br />Ik ontwerp en bouw digitale ervaringen die je merk versterken en verschil maken. Van concept tot lancering.
               </p>
             </motion.div>
          </div>

          <motion.div 
            className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            
            {/* Design Card */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ scale: 0.98 }}
              className="bg-white p-8 border border-black rounded-3xl flex flex-col justify-between hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-300 will-change-transform cursor-hover min-h-[500px]"
            >
              <div>
                <motion.div variants={itemVariants} className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center border border-black mb-8">
                  <PenTool size={32} />
                </motion.div>
                <motion.h3 variants={itemVariants} className="text-4xl font-bold mb-2 tracking-tight">Design</motion.h3>
                <motion.p variants={itemVariants} className="text-lg font-bold mb-6 opacity-80">Design dat werkt én converteert.</motion.p>
                <ul className="space-y-4">
                  {[
                    'High-end webdesign',
                    'Sterke visuele identiteit',
                    'UX / UI design',
                    'Conversiegericht ontwerp'
                  ].map((item, i) => (
                    <motion.li key={i} variants={itemVariants} className="flex items-center gap-3 text-lg font-bold">
                      <div className="w-6 h-6 flex-shrink-0 bg-[#FFD700] border border-black flex items-center justify-center text-xs">
                        <Plus size={14} strokeWidth={4} className="text-black" />
                      </div>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-100">
                <motion.p variants={itemVariants} className="text-gray-500 text-sm leading-relaxed font-medium">
                  Voor mij heeft design een doel. Ik ontwerp digitale ervaringen die vertrouwen opbouwen en impact maken.
                </motion.p>
              </div>
            </motion.div>

            {/* Development Card */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 0.98 }}
              className="bg-black text-white p-8 border border-black rounded-3xl flex flex-col justify-between hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] transition-shadow duration-300 will-change-transform cursor-hover min-h-[500px]"
            >
              <div>
                <motion.div variants={itemVariants} className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center mb-8">
                  <Code size={32} />
                </motion.div>
                <motion.h3 variants={itemVariants} className="text-4xl font-bold mb-2 tracking-tight">Development</motion.h3>
                <motion.p variants={itemVariants} className="text-lg font-bold mb-6 text-gray-300">Techniek die presteert. Altijd.</motion.p>
                <ul className="space-y-4">
                  {[
                    'Websites gebouwd voor performance',
                    'Snelle, toekomstbestendige code',
                    'SEO geïntegreerd',
                    'Schaalbaar & veilig vanaf dag één'
                  ].map((item, i) => (
                    <motion.li key={i} variants={itemVariants} className="flex items-center gap-3 text-lg font-bold">
                       <div className="w-6 h-6 flex-shrink-0 bg-[#FFD700] text-black flex items-center justify-center text-xs">
                        <Plus size={14} strokeWidth={4} />
                      </div>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 pt-8 border-t border-white/20">
                <motion.div variants={itemVariants} className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-4">
                   <motion.div
                     className="h-full bg-[#FFD700]"
                     animate={{ width: ["0%", "100%"] }}
                     transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
                   />
                </motion.div>
                <motion.p variants={itemVariants} className="text-gray-400 text-sm leading-relaxed font-medium">
                  Ik bouw razendsnelle, stabiele websites die hoog scoren in Google, veilig meegroeien en altijd online zijn.
                </motion.p>
              </div>
            </motion.div>

            {/* App Development Card */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 0.98 }}
              className="bg-[#FFD700] p-8 border border-black rounded-3xl flex flex-col justify-between hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-300 will-change-transform cursor-hover min-h-[500px]"
            >
              <div>
                <motion.div variants={itemVariants} className="w-16 h-16 bg-black rounded-full flex items-center justify-center border border-black mb-8">
                  <Smartphone size={32} className="text-white" />
                </motion.div>
                <motion.h3 variants={itemVariants} className="text-4xl font-bold mb-2 tracking-tight">App Development</motion.h3>
                <motion.p variants={itemVariants} className="text-lg font-bold mb-6 opacity-80">Apps die gebruikers niet vergeten.</motion.p>
                <ul className="space-y-4">
                  {[
                    'Native & cross-platform apps',
                    'Intuïtieve gebruikerservaring',
                    'Offline-first architectuur',
                    'Naadloze integraties'
                  ].map((item, i) => (
                    <motion.li key={i} variants={itemVariants} className="flex items-center gap-3 text-lg font-bold">
                      <div className="w-6 h-6 flex-shrink-0 bg-black border border-black flex items-center justify-center text-xs">
                        <Plus size={14} strokeWidth={4} className="text-white" />
                      </div>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 pt-8 border-t border-black/20">
                <motion.p variants={itemVariants} className="text-black/70 text-sm leading-relaxed font-medium">
                  Van concept tot App Store. Ik ontwikkel apps die snel, betrouwbaar en gebruiksvriendelijk zijn op elk apparaat.
                </motion.p>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Services;