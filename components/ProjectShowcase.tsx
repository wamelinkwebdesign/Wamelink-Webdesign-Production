import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, MotionValue, AnimatePresence, useInView, animate } from 'framer-motion';
import { ArrowUpRight, ArrowDown, X, Smartphone, Monitor, Palette, MousePointer2, History, Quote, ChevronLeft, ChevronRight, Copy, Type as TypeIcon } from 'lucide-react';
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
  url?: string;
  testimonial?: string;
  beforeImage?: string;
  stats: ProjectStats[];
  font?: string;
  bento?: ProjectBento;
  singleImage?: string;
}

const projects: ProjectData[] = [
  {
    id: '0',
    caseId: '01',
    title: 'Plus Dakbedekkingen',
    description: 'Herpositionering: Van lokaal dakdekkersbedrijf naar zakelijke partner voor aannemers en vastgoed.',
    image: 'https://storage.googleapis.com/wamelinkwebdesign/plusdak.png',
    year: '2025',
    color: '#FF5A1F', // Orange
    textColor: '#ffffff',
    tags: ['Development', 'Branding'],
    challenge: 'De bestaande website (5 jaar oud) sloot niet meer aan bij de groeiambities. De uitstraling was te kleinschalig om aannemers en vastgoedpartijen serieus aan te spreken, en de teksten misten de professionele \'wij-vorm\'.',
    solution: 'Een volledige \'rebuild\' met een strak, modern design. Door de combinatie van sterke lokale SEO in Meppel en een zakelijk uitstraling, staat er nu een platform dat direct vertrouwen wekt bij grote opdrachtgevers.',
    url: 'https://plusdakbedekkingen.nl',
    testimonial: "Je levert echt kwaliteit. Bedankt!",
    beforeImage: "https://storage.googleapis.com/wamelinkwebdesign/plus-before.png",
    stats: [
        { label: 'SEO SCORE', value: '100%' },
        { label: 'LEADS', value: '2.5x' },
        { label: 'LAADSNELHEID', value: '-10s' }
    ],
    bento: {
        desktop: 'https://storage.googleapis.com/wamelinkwebdesign/plusdak.png',
        mobile: 'https://storage.googleapis.com/wamelinkwebdesign/plus-ios.jpg', 
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
    tags: ['Brand Identity', 'Development'],
    challenge: 'Advancing solution collect.fyi miste in 2024 nog een gezicht naar de buitenwereld. Er was geen website en geen visuele identiteit om het product in de markt te zetten. De dienst was al succesvol, maar miste hun online aanwezigheid.',
    solution: 'Samen met de founders ben ik om tafel gegaan om het merk te definiëren. We hebben het kleurenschema en de online identiteit vastgesteld die passen bij hun visie. Deze stijl heb ik vervolgens vertaald naar een maatwerk WordPress website. Het resultaat is een sterke online identiteit die nu naadloos aansluit op de ervaring van hun diensten.',
    stats: [],
    font: 'Roboto',
    bento: {
        desktop: 'https://storage.googleapis.com/wamelinkwebdesign/collectfyi.png',
        mobile: 'https://storage.googleapis.com/wamelinkwebdesign/collect-mobile.jpg',
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
    color: '#442139', // Updated Dark Purple
    textColor: '#ffffff',
    tags: ['Troubleshooting', 'Optimalisatie'],
    challenge: 'De website kampte met achterstallig onderhoud en conflicterende plugins na een update. Dit resulteerde in een \'broken\' design en haperende contactformulieren, precies op het moment dat de oorspronkelijke designers niet meer betrokken waren.',
    solution: 'Ik heb de technische bugs gladgestreken en de formulieren weer werkend gekregen. Vanuit die stabiele basis hebben we de site direct verbeterd: ik heb nieuwe contentpagina\'s voor trainingen gebouwd en de \'look & feel\' op details geperfectioneerd.',
    url: 'https://personal-excellence.nl',
    stats: [],
    singleImage: 'https://storage.googleapis.com/wamelinkwebdesign/personalexcellence.png'
  }
];

// --- Helper Components ---

const ComparisonSlider: React.FC<{ before: string; after: string }> = ({ before, after }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-3xl overflow-hidden cursor-ew-resize select-none shadow-2xl group border border-black/5"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* After Image (Background - Right Side "NU") */}
      <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover object-left-top" />
      <div className="absolute top-6 right-6 bg-black/60 backdrop-blur text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest z-10 pointer-events-none">
        Nu
      </div>

      {/* Before Image (Foreground - Left Side "VOORHEEN") */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img src={before} alt="Before" className="absolute inset-0 w-full h-full object-cover object-left-top" />
        <div className="absolute top-6 left-6 bg-black/60 backdrop-blur text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest z-10 pointer-events-none">
          Voorheen
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white z-20 cursor-ew-resize"
        style={{ left: `${sliderPos}%` }}
      >
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-transform group-hover:scale-110">
            <div className="flex gap-0.5">
               <ChevronLeft size={16} className="text-black" />
               <ChevronRight size={16} className="text-black" />
            </div>
         </div>
      </div>
    </div>
  );
};

const AnimatedStat: React.FC<{ value: string; color?: string; dark?: boolean }> = ({ value, color, dark }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  // Extract number and surrounding text
  const match = value.match(/^([^0-9.]*)(\d+(?:\.\d+)?)(.*)$/);
  
  // If no number found, just render text
  if (!match) {
    return (
      <span ref={ref} className="block">
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
    <span ref={ref} className="flex items-baseline justify-center" style={{ color: color }}>
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
            <div className="relative w-full mb-4 md:mb-6" style={{ color: project.textColor }}>
               <div className="relative z-20 flex justify-between items-center w-full pointer-events-none">
                  <div className="pointer-events-auto">
                    <motion.div layoutId={`card-meta-${project.id}`} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      <span className="text-sm font-bold uppercase tracking-widest opacity-70 border border-current px-3 py-1 rounded-full w-fit bg-black/5 backdrop-blur-sm">
                        Case {project.caseId}
                      </span>
                      <span className="text-sm font-bold tracking-widest opacity-50 hidden md:block">{project.year}</span>
                    </motion.div>
                  </div>
                  <div className="pointer-events-auto">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center text-black border border-black/10 shadow-lg group-hover:scale-110 transition-transform">
                          <ArrowUpRight size={24} className="group-hover:rotate-45 transition-transform duration-300" />
                      </div>
                  </div>
               </div>
            </div>

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
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2 translate-y-4 group-hover:translate-y-0">
                     Bekijk Case <ArrowUpRight size={16} />
                  </div>
                </motion.div>
            </div>

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

  // Bento Grid Parallax Refs
  const bentoRef = useRef(null);
  const { scrollYProgress: bentoScroll } = useScroll({
    target: bentoRef,
    container: scrollRef,
    offset: ["start end", "end start"]
  });
  const parallaxY = useTransform(bentoScroll, [0, 1], [0, -40]);

  useEffect(() => {
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
      {/* Fixed Close Button */}
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

         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
           className="w-full flex justify-center pb-8"
         >
            <ArrowDown className="animate-bounce opacity-50" size={32} />
         </motion.div>
      </motion.div>

      {/* 2. MAIN CONTENT SECTION (White Background) */}
      <section className="bg-white text-black py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-8">
           
           {/* Row 1: The Text Split (Challenge vs Solution) */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 mb-24 md:mb-32">
              <div>
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                >
                   <h3 className="text-2xl font-black uppercase tracking-tight mb-4">De Uitdaging</h3>
                   <div className="w-16 h-1 mb-8" style={{ backgroundColor: project.color }} />
                   <p className="text-lg md:text-xl font-medium leading-relaxed text-gray-800">
                     {project.challenge}
                   </p>
                </motion.div>
              </div>
              
              <div>
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 }}
                   viewport={{ once: true }}
                >
                   <h3 className="text-2xl font-black uppercase tracking-tight mb-4">De Oplossing</h3>
                   <div className="w-16 h-1 mb-8" style={{ backgroundColor: project.color }} />
                   <p className="text-lg md:text-xl font-medium leading-relaxed text-gray-600">
                     {project.solution}
                   </p>
                </motion.div>
              </div>
           </div>

           {/* Row 2: The Visual Proof (Comparison Slider) */}
           {project.beforeImage && project.bento && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="mb-24 md:mb-32"
             >
               <ComparisonSlider before={project.beforeImage} after={project.bento.desktop} />
             </motion.div>
           )}

           {/* Row 3: The Results (Metrics & CTA) */}
           <div className="flex flex-col items-center">
              
              {/* Metrics - Only show if stats are present */}
              {project.stats.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24 text-center mb-16 w-full max-w-4xl">
                   {project.stats.map((stat, i) => (
                      <div key={i} className="flex flex-col items-center relative">
                         {/* Divider for desktop */}
                         {i !== 0 && (
                            <div className="hidden md:block absolute left-[-3rem] top-1/2 -translate-y-1/2 h-12 w-[1px] bg-gray-200" />
                         )}
                         
                         <div className="text-5xl md:text-6xl font-black mb-2 tracking-tighter text-black">
                            <AnimatedStat value={stat.value} />
                         </div>
                         <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                            {stat.label}
                         </div>
                      </div>
                   ))}
                </div>
              )}

              {/* CTA Button */}
              <MagneticButton>
                 {project.url ? (
                     <a href={project.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-black text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-[#FFD700] hover:text-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all transform hover:-translate-y-1 text-sm md:text-base">
                        Bekijk Website <ArrowUpRight size={20} />
                     </a>
                 ) : (
                     <button className="flex items-center gap-4 bg-black text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-[#FFD700] hover:text-black transition-all">
                        Bekijk Website <ArrowUpRight size={20} />
                     </button>
                 )}
              </MagneticButton>

           </div>

        </div>
      </section>

      {/* Swiss Style Testimonial Section */}
      {project.testimonial && (
        <section className="bg-white text-black py-24 md:py-32 border-t border-black/5 overflow-hidden">
           <div className="container mx-auto px-4 sm:px-8 relative">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                 {/* Left: Giant Quote Mark / Label */}
                 <div className="lg:col-span-4 relative">
                    <motion.div 
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       className="sticky top-32"
                    >
                       <Quote 
                          size={120} 
                          className="mb-8"
                          style={{ color: project.color, fill: project.color, opacity: 0.2 }} 
                          strokeWidth={0}
                       />
                       <div className="flex items-center gap-4">
                          <div className="h-[1px] w-12 bg-black"></div>
                          <span className="text-xs font-bold uppercase tracking-widest opacity-50">Klant Feedback</span>
                       </div>
                    </motion.div>
                 </div>

                 {/* Right: The Quote */}
                 <div className="lg:col-span-8">
                    <motion.blockquote 
                       initial={{ opacity: 0, x: 20 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       viewport={{ once: true }}
                       transition={{ delay: 0.2 }}
                       className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tight uppercase"
                    >
                       "{project.testimonial}"
                    </motion.blockquote>
                 </div>
              </div>
           </div>
        </section>
      )}

      {/* 3. Bento Grid - Refactored for Premium Look (or Single Image) */}
      <section ref={bentoRef} className="bg-gray-50 py-32 overflow-hidden border-t border-black/5">
         <div className="container mx-auto px-4 sm:px-8">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="flex items-center justify-between mb-16"
            >
               <h4 className="text-xs font-bold uppercase tracking-widest opacity-40">Design Details</h4>
               <div className="h-[1px] flex-1 bg-black/10 mx-6" />
               <div className="text-xs font-mono opacity-40">System_V1.0</div>
            </motion.div>

            {project.singleImage ? (
               <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="w-full"
               >
                  <img 
                    src={project.singleImage} 
                    alt="Design Overview" 
                    className="w-full h-auto rounded-[2.5rem] shadow-2xl border border-black/5"
                  />
               </motion.div>
            ) : project.bento ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 auto-rows-[minmax(200px,auto)]">
               
                   {/* Card 1: Mobile Mockup (Left Column) */}
                   <motion.div 
                     initial={{ opacity: 0, y: 40 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.8, ease: "easeOut" }}
                     className="lg:col-span-5 row-span-2 relative h-[600px] lg:h-auto rounded-[2.5rem] overflow-hidden shadow-2xl bg-[#EBEBEB] group"
                   >
                      {/* Background Element */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-200 opacity-50" />
                      
                      {/* Floating Label */}
                      <div className="absolute top-8 left-8 z-20">
                         <span className="bg-black/10 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-black flex items-center gap-2 border border-white/20">
                           <Smartphone size={12} /> Mobile View
                         </span>
                      </div>

                      {/* Parallax Image */}
                      <motion.div 
                         style={{ y: parallaxY }}
                         className="absolute inset-0 top-[10%] w-full h-[120%]"
                      >
                         <img 
                            src={project.bento.mobile} 
                            alt="Mobile Design" 
                            className="w-[85%] mx-auto h-auto rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-[8px] border-white ring-1 ring-black/5 object-cover"
                         />
                      </motion.div>
                   </motion.div>

                   {/* Right Column Stack */}
                   <div className="lg:col-span-7 grid grid-cols-1 gap-8 h-full">
                      
                      {/* Card 2: Typography Specimen */}
                      <motion.div 
                         initial={{ opacity: 0, x: 40 }}
                         whileInView={{ opacity: 1, x: 0 }}
                         viewport={{ once: true }}
                         transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                         className="relative min-h-[400px] rounded-[2.5rem] p-10 flex flex-col justify-between overflow-hidden shadow-xl"
                         style={{ backgroundColor: project.color, color: project.textColor }}
                      >
                         {/* Header */}
                         <div className="flex justify-between items-start z-10">
                            <span className="border border-current opacity-30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                               <TypeIcon size={12} /> Typography
                            </span>
                            <span className="text-5xl font-serif italic opacity-20">Aa</span>
                         </div>

                         {/* Main Content */}
                         <div className="relative z-10 mt-8">
                            <h3 className="text-7xl font-black tracking-tighter leading-none mb-2">
                               {project.font || 'Inter Tight'}
                            </h3>
                            <div className="flex gap-6 mt-6 opacity-60 text-sm font-mono">
                               <span>Regular</span>
                               <span>Medium</span>
                               <span>Bold</span>
                            </div>
                         </div>

                         {/* Background Pattern */}
                         <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.07] select-none">
                            <p className="text-[8rem] leading-[0.8] font-black break-words w-[120%] -ml-4 -mt-4">
                               ABCDEFGHIJKLMNOPQRSTUVWXYZ
                            </p>
                         </div>
                      </motion.div>

                      {/* Card 3: Color Palette Strip */}
                      <motion.div 
                         initial={{ opacity: 0, y: 40 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                         transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                         className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-black/5 flex flex-col justify-center"
                      >
                         <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-2">
                               <Palette size={16} className="text-gray-400" />
                               <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Color Palette</span>
                            </div>
                            <div className="text-[10px] font-mono text-gray-300">HEX / RGB</div>
                         </div>
                         
                         <div className="flex w-full h-24 gap-4">
                            {project.bento.palette.map((hex, i) => (
                               <motion.div 
                                 key={i}
                                 whileHover={{ scale: 1.05, y: -5 }}
                                 className="group relative flex-1 h-full rounded-2xl cursor-pointer shadow-sm ring-1 ring-black/5 overflow-hidden"
                                 style={{ backgroundColor: hex }}
                               >
                                  {/* Hover Reveal */}
                                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                     <div className="bg-white px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <Copy size={12} className="text-black" />
                                        <span className="text-[10px] font-mono font-bold text-black uppercase">{hex}</span>
                                     </div>
                                  </div>
                               </motion.div>
                            ))}
                         </div>
                      </motion.div>
                      
                   </div>
                </div>
            ) : null}
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

const ProjectShowcase: React.FC = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  return (
    <section ref={containerRef} id="work" className="bg-white relative border-t border-black">
      <div className="container mx-auto px-4 sm:px-8 pt-32 pb-12">
           <h2 className="text-[12vw] leading-[0.8] font-black tracking-tighter uppercase mb-24 text-black select-none pointer-events-none">
             Selected<br />
             <span className="text-transparent" style={{ WebkitTextStroke: '1px black' }}>Work</span>
           </h2>
      </div>

      <div className="flex flex-col gap-0 pb-[20vh]">
        {projects.map((project, i) => {
          const targetScale = 1 - ((projects.length - i) * 0.05);
          return (
            <Card
              key={project.id}
              i={i}
              project={project}
              progress={scrollYProgress}
              range={[i * (1 / projects.length), 1]}
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
    </section>
  );
};

export default ProjectShowcase;