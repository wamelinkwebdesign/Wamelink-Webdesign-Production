import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, MotionValue, AnimatePresence, useInView, animate } from 'framer-motion';
import { ArrowUpRight, ArrowDown, X, Smartphone, Monitor, Palette, MousePointer2 } from 'lucide-react';
import MagneticButton from './MagneticButton';

// --- Data & Types ---

interface ProjectStats {
  label: string;
  value: string;
}

interface ProjectBento {
  desktop: string;
  mobile: string;
  palette: string[];
}

interface ProjectData {
  id: string;
  caseId: string;
  title: string;
  description: string;
  image: string;
  year: string;
  color: string;
  textColor: string;
  tags: string[];
  challenge: string;
  solution: string;
  stats: ProjectStats[];
  bento: ProjectBento;
}

const projects: ProjectData[] = [
  {
    id: '0',
    caseId: '01',
    title: 'Plus Dakbedekkingen',
    description: 'Specialist in duurzame dakrenovaties en zinkwerk.',
    image: 'https://storage.googleapis.com/wamelinkwebdesign/plusdak.png',
    year: '2025',
    color: '#FF5A1F', // Orange
    textColor: '#ffffff',
    tags: ['Development', 'Branding'],
    challenge: 'Transitie van een traditioneel lokaal bedrijf naar een moderne, digitale autoriteit in de dakdekkersbranche.',
    solution: 'Een conversiegerichte website die vertrouwen uitstraalt en vakmanschap combineert met een krachtige visuele identiteit.',
    stats: [
        { label: 'SEO Score', value: '100%' },
        { label: 'Leads', value: '2.5x' },
        { label: 'Snelheid', value: '<0.8s' }
    ],
    bento: {
        desktop: 'https://storage.googleapis.com/wamelinkwebdesign/plusdak.png',
        mobile: 'https://storage.googleapis.com/wamelinkwebdesign/plusdak.png', 
        palette: ['#FF5A1F', '#111111', '#F5F5F5']
    }
  },
  {
    id: '1',
    caseId: '02',
    title: 'Collect.fyi',
    description: 'De one-stop shop voor artiesten tour management.',
    image: 'https://storage.googleapis.com/wamelinkwebdesign/collectfyi.png',
    year: '2024',
    color: '#FFD700', // Yellow
    textColor: '#000000',
    tags: ['Platform', 'Strategy'],
    challenge: 'Vereenvoudiging van complexe tourlogistiek voor artiesten in één intuïtieve interface.',
    solution: 'Een mobile-first dashboard dat reisplannen, contacten en documenten real-time samenbrengt.',
    stats: [
        { label: 'Gebruikers', value: '5k+' },
        { label: 'Retentie', value: '92%' },
        { label: 'Uptime', value: '99.9%' }
    ],
    bento: {
        desktop: 'https://storage.googleapis.com/wamelinkwebdesign/collectfyi.png',
        mobile: 'https://storage.googleapis.com/wamelinkwebdesign/collectfyi.png',
        palette: ['#FFD700', '#000000', '#FFFFFF']
    }
  },
  {
    id: '2',
    caseId: '03',
    title: 'Personal Excellence',
    description: 'Toonaangevend coachingbureau voor professionele groei.',
    image: 'https://storage.googleapis.com/wamelinkwebdesign/personalexcellence.png',
    year: '2023',
    color: '#2E1A47', // Dark Purple
    textColor: '#ffffff',
    tags: ['Web Design', 'Identity'],
    challenge: 'Rebranding van een corporate coachingbureau om een jongere, ambitieuze doelgroep aan te spreken.',
    solution: 'Een verfijnde \'dark-mode\' esthetiek die autoriteit en modern professionalisme uitstraalt.',
    stats: [
        { label: 'Groei', value: '40%' },
        { label: 'Boekingen', value: '+150%' },
        { label: 'Award', value: 'Awwwards' }
    ],
    bento: {
        desktop: 'https://storage.googleapis.com/wamelinkwebdesign/personalexcellence.png',
        mobile: 'https://storage.googleapis.com/wamelinkwebdesign/personalexcellence.png',
        palette: ['#2E1A47', '#D4AF37', '#F5F5F5']
    }
  },
  {
    id: '3',
    caseId: '04',
    title: 'Clayrety',
    description: 'Expert in Himalaya klankschaalsessies en innerlijke rust.',
    image: 'https://storage.googleapis.com/wamelinkwebdesign/clayrety.png',
    year: '2023',
    color: '#8AB6F9', // Lighter Blue
    textColor: '#ffffff',
    tags: ['E-commerce', 'Motion'],
    challenge: 'De auditieve ervaring van sound healing vertalen naar een visuele, digitale omgeving.',
    solution: 'Een serene ervaring rijk aan beweging, met vloeiende animaties en zachte kleurenpaletten.',
    stats: [
        { label: 'Verkoop', value: '+200%' },
        { label: 'Sessies', value: 'Vol' },
        { label: 'Bereik', value: 'Globaal' }
    ],
    bento: {
        desktop: 'https://storage.googleapis.com/wamelinkwebdesign/clayrety.png',
        mobile: 'https://storage.googleapis.com/wamelinkwebdesign/clayrety.png',
        palette: ['#8AB6F9', '#FFFFFF', '#333333']
    }
  }
];

// --- Helper Components ---

const AnimatedStat: React.FC<{ value: string; color: string }> = ({ value, color }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  // Extract number and surrounding text
  // Regex looks for: (prefix)(number)(suffix)
  const match = value.match(/^([^0-9.]*)(\d+(?:\.\d+)?)(.*)$/);
  
  // If no number found (e.g., "Awwwards"), just render text
  if (!match) {
    return (
      <span ref={ref} style={{ color }} className="block">
         <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
         >
            {value}
         </motion.span>
      </span>
    );
  }

  const prefix = match[1];
  const number = parseFloat(match[2]);
  const suffix = match[3];
  const isDecimal = match[2].includes('.');

  return (
    <span ref={ref} className="flex justify-center items-baseline" style={{ color }}>
      <span>{prefix}</span>
      <Counter from={0} to={number} duration={1.5} isDecimal={isDecimal} isInView={isInView} />
      <span>{suffix}</span>
    </span>
  );
};

const Counter = ({ from, to, duration, isDecimal, isInView }: { from: number; to: number; duration: number; isDecimal: boolean; isInView: boolean }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node || !isInView) return;

    const controls = animate(from, to, {
      duration: duration,
      ease: "easeOut",
      onUpdate(value) {
        node.textContent = isDecimal ? value.toFixed(1) : Math.round(value).toString();
      }
    });

    return () => controls.stop();
  }, [from, to, duration, isDecimal, isInView]);

  return <span ref={nodeRef}>{from}</span>;
};

// --- Components ---

interface CardProps {
  i: number;
  project: ProjectData;
  progress: MotionValue<number>;
  range: number[];
  targetScale: number;
  onSelect: (project: ProjectData) => void;
}

const Card: React.FC<CardProps> = ({ i, project, progress, range, targetScale, onSelect }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start']
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1]); 
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div 
      ref={containerRef} 
      className="h-screen flex items-center justify-center sticky top-12 md:top-24"
      style={{ zIndex: i + 1 }}
    >
      {/* Wrapper to handle positioning and scale - isolates these from layout animation */}
      <motion.div 
         style={{ 
          scale,
          y: `calc(-5vh + ${i * 25}px)` 
        }} 
        className="relative w-full max-w-[95vw] md:max-w-[90vw] h-[80vh] md:h-[85vh] origin-top will-change-transform"
      >
        <motion.div 
          layoutId={`card-container-${project.id}`}
          onClick={() => onSelect(project)}
          whileHover={{ 
            y: -15, 
            transition: { duration: 0.3, ease: "easeOut" } 
          }}
          style={{ 
            backgroundColor: project.color, 
          }} 
          className="w-full h-full flex flex-col rounded-[2rem] md:rounded-[3rem] border border-black/10 overflow-hidden shadow-2xl cursor-pointer group hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] transition-shadow duration-300 relative"
        >
          <div className="flex flex-col h-full p-8 md:p-14 lg:p-16 relative z-10">
            
            {/* Header: Layered approach for robust centering */}
            <div className="relative w-full mb-4 md:mb-6" style={{ color: project.textColor }}>
               
               {/* Controls (Relative, Left/Right) - Title Removed */}
               <div className="relative z-20 flex justify-between items-center w-full pointer-events-none">
                  {/* Left: Meta */}
                  <div className="pointer-events-auto">
                    <motion.div layoutId={`card-meta-${project.id}`} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      <span className="text-sm font-bold uppercase tracking-widest opacity-70 border border-current px-3 py-1 rounded-full w-fit bg-black/5 backdrop-blur-sm">
                        Case {project.caseId}
                      </span>
                      <span className="text-sm font-bold tracking-widest opacity-50 hidden md:block">{project.year}</span>
                    </motion.div>
                  </div>

                  {/* Right: Arrow Button */}
                  <div className="pointer-events-auto">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center text-black border border-black/10 shadow-lg group-hover:scale-110 transition-transform">
                          <ArrowUpRight size={24} className="group-hover:rotate-45 transition-transform duration-300" />
                      </div>
                  </div>
               </div>
            </div>

            {/* Image */}
            <div className="flex-1 w-full relative flex items-center justify-center overflow-hidden rounded-2xl md:rounded-3xl mb-6 shadow-xl bg-black/5">
                <motion.div 
                  style={{ scale: imageScale }}
                  className="w-full h-full relative"
                >
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2 translate-y-4 group-hover:translate-y-0">
                     Bekijk Case <ArrowUpRight size={16} />
                  </div>
                </motion.div>
            </div>

            {/* Footer */}
            <div className="flex justify-end w-full relative z-20" style={{ color: project.textColor }}>
                <div className="flex flex-wrap gap-2 justify-end w-full md:w-auto">
                   {project.tags.slice(0, 2).map((tag, idx) => (
                     <span key={idx} className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs md:text-sm font-bold uppercase tracking-wider border border-current whitespace-nowrap">
                       {tag}
                     </span>
                   ))}
                </div>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// --- Detail View Component ---

const DetailView: React.FC<{ project: ProjectData; onClose: () => void }> = ({ project, onClose }) => {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  // Bento Grid Parallax Refs
  const bentoRef = useRef(null);
  const { scrollYProgress: bentoScroll } = useScroll({
    target: bentoRef,
    container: scrollRef,
    offset: ["start end", "end start"]
  });
  const mobileParallax = useTransform(bentoScroll, [0, 1], [50, -50]);

  useEffect(() => {
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-white overflow-y-auto no-scrollbar"
      ref={scrollRef}
      data-lenis-prevent
    >
      {/* Fixed Close Button - Magnetic */}
      <div className="fixed top-6 right-6 z-[120]">
        <MagneticButton onClick={onClose}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.3 } }}
            className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:bg-black hover:text-white transition-colors border border-black/5"
          >
            <X size={24} />
          </motion.div>
        </MagneticButton>
      </div>

      {/* Sticky Header */}
      <motion.div 
        style={{ opacity: headerOpacity }}
        className="fixed top-0 left-0 w-full h-20 bg-white/90 backdrop-blur-md z-[110] border-b border-black/5 flex items-center px-8"
      >
         <span className="font-bold uppercase tracking-widest text-sm">{project.title}</span>
      </motion.div>

      {/* 1. Immersive Hero */}
      <motion.div 
        layoutId={`card-container-${project.id}`}
        style={{ backgroundColor: project.color, color: project.textColor }}
        className="relative w-full h-[90vh] md:h-screen flex flex-col justify-between p-6 md:p-12"
      >
         {/* Meta */}
         <div className="flex justify-between items-center">
            <motion.div layoutId={`card-meta-${project.id}`} className="flex flex-col md:flex-row gap-4 md:gap-12 opacity-80">
               <div className="flex flex-col">
                 <span className="text-[10px] uppercase tracking-widest opacity-60">Klant</span>
                 <span className="text-lg font-bold">{project.title}</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-[10px] uppercase tracking-widest opacity-60">Jaar</span>
                 <span className="text-lg font-bold">{project.year}</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-[10px] uppercase tracking-widest opacity-60">Diensten</span>
                 <span className="text-lg font-bold">{project.tags.join(', ')}</span>
               </div>
            </motion.div>
         </div>

         {/* Title */}
         <div className="flex-1 flex items-center justify-center py-12">
            <motion.div layoutId={`card-title-${project.id}`} className="text-center w-full">
              <h1 className="text-[10vw] font-black uppercase leading-[0.8] tracking-tighter break-words">
                {project.title}
              </h1>
            </motion.div>
         </div>

         {/* Scroll Indicator */}
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
           className="w-full flex justify-center pb-8"
         >
            <ArrowDown className="animate-bounce opacity-50" size={32} />
         </motion.div>
      </motion.div>

      {/* 2. Project Overview */}
      <section className="bg-white text-black py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
             <div className="md:col-span-4">
               <div className="sticky top-32">
                 <h3 className="text-4xl font-black uppercase tracking-tighter mb-8">De Uitdaging</h3>
                 <div className="w-12 h-1" style={{ backgroundColor: project.color }} />
               </div>
             </div>
             <div className="md:col-span-8">
               <motion.p 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 className="text-2xl md:text-4xl font-medium leading-tight mb-12"
               >
                 {project.challenge}
               </motion.p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-lg text-gray-600 leading-relaxed mb-12">
                  <p>{project.solution}</p>
                  <p>We hebben een strategie geïmplementeerd gericht op high-impact visuals en gestroomlijnde gebruikerservaringen om conversie te maximaliseren.</p>
               </div>
               
               <MagneticButton className="inline-block">
                 <button className="flex items-center gap-4 bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                   Bekijk Website <ArrowUpRight />
                 </button>
               </MagneticButton>
             </div>
          </div>
        </div>
      </section>

      {/* 3. Bento Grid Gallery */}
      <section ref={bentoRef} className="bg-[#F5F5F5] py-24 overflow-hidden">
         <div className="container mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(300px,auto)]">
               
               {/* Card 1: Desktop Mockup */}
               <motion.div 
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="md:col-span-8 bg-white rounded-[40px] overflow-hidden shadow-xl min-h-[500px] relative group"
               >
                  <div className="absolute top-8 left-8 z-10">
                     <span className="bg-black/5 backdrop-blur px-4 py-2 rounded-full text-xs font-bold uppercase flex items-center gap-2">
                       <Monitor size={14} /> Desktop Ervaring
                     </span>
                  </div>
                  <img 
                    src={project.bento.desktop} 
                    alt="Desktop" 
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105"
                  />
               </motion.div>

               {/* Card 2: Mobile Mockup - Parallax Effect */}
               <motion.div 
                 style={{ y: mobileParallax }}
                 className="md:col-span-4 row-span-2 bg-[#1a1a1a] rounded-[40px] overflow-hidden shadow-xl relative flex items-center justify-center p-8"
               >
                  <div className="absolute top-8 left-8 z-10">
                     <span className="bg-white/10 backdrop-blur text-white px-4 py-2 rounded-full text-xs font-bold uppercase flex items-center gap-2">
                       <Smartphone size={14} /> Mobile First
                     </span>
                  </div>
                  <div className="w-[85%] aspect-[9/19] bg-white rounded-[2.5rem] border-[8px] border-[#333] overflow-hidden relative shadow-2xl">
                     <img 
                        src={project.bento.mobile} 
                        alt="Mobile" 
                        className="w-full h-full object-cover"
                     />
                  </div>
               </motion.div>

               {/* Card 3: Brand Assets */}
               <motion.div 
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 viewport={{ once: true }}
                 className="md:col-span-4 bg-white rounded-[40px] p-8 flex flex-col justify-between shadow-xl min-h-[300px]"
               >
                  <div>
                    <span className="bg-black/5 px-4 py-2 rounded-full text-xs font-bold uppercase flex items-center gap-2 w-fit mb-8">
                       <Palette size={14} /> Design Systeem
                     </span>
                    <h4 className="text-3xl font-bold mb-2">Visuele<br/>Identiteit</h4>
                  </div>
                  <div className="flex gap-4">
                     {project.bento.palette.map((hex, i) => (
                        <div key={i} className="flex-1 aspect-square rounded-2xl flex items-end p-4 border border-black/5 relative group" style={{ backgroundColor: hex }}>
                           <span className="bg-white/90 text-black px-1 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity rounded">{hex}</span>
                        </div>
                     ))}
                  </div>
               </motion.div>

               {/* Card 4: Detail */}
               <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                  className="md:col-span-4 rounded-[40px] p-8 flex flex-col justify-center text-white shadow-xl"
                  style={{ backgroundColor: project.color, color: project.textColor }}
               >
                  <p className="font-mono text-sm opacity-60 mb-4">Typografie</p>
                  <span className="text-6xl font-black tracking-tighter leading-[0.8]">Aa</span>
                  <span className="text-xl font-bold mt-2">Inter Tight</span>
               </motion.div>

            </div>
         </div>
      </section>

      {/* 4. Key Results / Stats - Animated */}
      <section className="bg-[#111] py-24 text-white">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-white/10">
             {project.stats.map((stat, i) => (
               <div key={i} className="text-center pt-8 md:pt-0 px-4">
                 <div className="text-[10vw] md:text-[5vw] font-black leading-none mb-2">
                   <AnimatedStat value={stat.value} color={project.color} />
                 </div>
                 <div className="text-lg uppercase tracking-widest font-bold text-gray-400">
                   {stat.label}
                 </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 5. Footer / Next Case */}
      <section className="bg-white py-0 border-t border-black">
         <div className="container mx-auto px-4 sm:px-8">
            <button 
              onClick={onClose}
              className="group block w-full text-left py-24 md:py-32 relative overflow-hidden cursor-hover"
            >
               <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block group-hover:text-black transition-colors">Sluit Project</span>
               
               {/* Hover Effect: Solid to Transparent with Stroke */}
               <h2 className="text-[8vw] font-black uppercase tracking-tighter leading-none transition-all duration-300 group-hover:text-transparent group-hover:text-stroke-black">
                 Terug naar Werk
               </h2>
               
               <div className="absolute right-0 bottom-1/2 translate-y-1/2 p-8 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center">
                    <MousePointer2 size={32} />
                  </div>
               </div>
            </button>
         </div>
         <style>{`
          .group:hover .group-hover\\:text-stroke-black {
             -webkit-text-stroke: 2px black;
          }
         `}</style>
      </section>

    </motion.div>
  );
};

// --- Main Showcase Component ---

const ProjectShowcase: React.FC = () => {
  const containerRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  return (
    <section id="work" ref={containerRef} className="relative bg-[#F9F5F1] py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-8 mb-24 md:mb-32">
         <motion.h2 
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="text-[14vw] md:text-[10vw] leading-[0.8] font-black uppercase tracking-tighter text-[#111111]"
         >
           Geselecteerd<br/>
           <span className="text-transparent stroke-text">Werk</span>
         </motion.h2>
      </div>

      <div className="mt-[-10vh]">
        {projects.map((project, i) => {
          const targetScale = 1 - ( (projects.length - i) * 0.05 );
          return (
            <Card 
              key={project.id} 
              i={i} 
              project={project}
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
              onSelect={setSelectedProject}
            />
          );
        })}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <DetailView 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
      
      <style>{`
        .stroke-text {
          -webkit-text-stroke: 1px #111111;
        }
        @media (min-width: 768px) {
          .stroke-text {
            -webkit-text-stroke: 2px #111111;
          }
        }
      `}</style>
    </section>
  );
};

export default ProjectShowcase;