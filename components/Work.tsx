import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const projects = [
  {
    id: '1',
    caseId: '01',
    title: 'collect.fyi',
    description: 'De one-stop shop voor artiesten die hun tourleven willen vereenvoudigen.',
    image: 'https://storage.googleapis.com/wamelinkwebdesign/collectfyi-nobg-s.png', 
    color: '#ffcf00',
    textColor: '#000000'
  },
  {
    id: '2',
    caseId: '02',
    title: 'Personal Excellence',
    description: 'Een toonaangevend coachingbureau dat zich specialiseert in persoonlijke en professionele ontwikkeling.',
    image: 'https://storage.googleapis.com/wamelinkwebdesign/personal-excellence-nobg-s.png',
    color: '#442139',
    textColor: '#ffffff'
  }
];

const ProjectCard = ({ project, index, total }: any) => {
  return (
    <div 
      className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden border-t border-black/5 will-change-transform"
      style={{ 
        backgroundColor: project.color, 
        color: project.textColor,
        zIndex: index + 1
      }}
    >
      <div className="container mx-auto px-4 sm:px-8 relative h-full flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 relative z-10">
             <div className="mb-6">
                <span className="inline-block px-3 py-1 border border-current rounded-full text-xs font-bold uppercase tracking-widest opacity-70">
                  Case {project.caseId}
                </span>
             </div>
             
             <motion.h3 
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.1 }}
               viewport={{ once: true }}
               className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none"
             >
               {project.title}
             </motion.h3>
             
             <motion.p 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               transition={{ duration: 0.6, delay: 0.2 }}
               viewport={{ once: true }}
               className="text-xl md:text-2xl font-medium leading-relaxed mb-12 max-w-lg opacity-90"
             >
               {project.description}
             </motion.p>

             <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true }}
                className="group flex items-center gap-4 text-lg font-bold uppercase tracking-widest"
             >
                <span className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center group-hover:bg-white group-hover:border-white group-hover:text-black transition-colors">
                  <ArrowUpRight size={24} />
                </span>
                Bekijk project
             </motion.button>
          </div>

          <div className="lg:col-span-7 relative">
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               whileInView={{ scale: 1, opacity: 1 }}
               transition={{ duration: 0.8, ease: "easeOut" }}
               viewport={{ once: true }}
               className="relative aspect-[4/3] rounded-3xl overflow-hidden"
            >
               <img 
                 src={project.image} 
                 alt={project.title} 
                 className="w-full h-full object-contain p-8 transform hover:scale-105 transition-transform duration-700 drop-shadow-2xl" 
               />
            </motion.div>
          </div>

        </div>

        {/* Counter decoration */}
        <div className="absolute bottom-8 left-4 sm:left-8 text-sm font-bold uppercase tracking-widest opacity-50">
          {index + 1} — {total}
        </div>
      </div>
    </div>
  );
};

const Work: React.FC = () => {
  return (
    <section id="work" className="relative bg-white border-t border-black">
      {/* Header section that scrolls away naturally */}
      <div className="py-24 px-4 sm:px-8 container mx-auto">
           <h2 className="text-[12vw] leading-[0.8] font-black tracking-tighter uppercase opacity-10 select-none pointer-events-none text-black">
             Portfolio
           </h2>
      </div>

      {/* Stacking Cards Container */}
      <div className="relative">
        {projects.map((project, i) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            index={i}
            total={projects.length}
          />
        ))}
      </div>
    </section>
  );
};

export default Work;