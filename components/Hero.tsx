import React, { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import MagneticButton from './MagneticButton';

// --- Components ---

const Cursor = ({ blinking, isDot }: { blinking: boolean; isDot?: boolean }) => (
  <motion.span
    initial={{ opacity: 1, width: "0.15em", height: "0.75em", borderRadius: "0%", y: "0em" }}
    animate={{ 
      opacity: blinking ? [1, 0, 1] : 1,
      width: isDot ? "0.35em" : "0.15em",
      height: isDot ? "0.35em" : "0.75em",
      borderRadius: isDot ? "50%" : "0%",
      y: isDot ? "0.05em" : "0em"
    }}
    transition={{ 
      opacity: blinking 
        ? { duration: 0.8, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }
        : { duration: 0.1 }, // Instant visibility when typing starts
      default: { duration: 0.3, type: "spring", stiffness: 300, damping: 25 }
    }}
    className="inline-block bg-[#FFD700] ml-1 md:ml-2 align-baseline"
  />
);

const Hero: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);

  // Typewriter State
  const [line2, setLine2] = useState("");
  const [isImpact, setIsImpact] = useState(false); // Triggers the solid fill
  const [showCursor, setShowCursor] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const randomSpeed = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
    
    // Helper: Wait function
    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Helper: Type a string
    const typeString = async (text: string, speed: 'fast' | 'heavy') => {
        setIsTyping(true);
        // Start loop at 1 so the first character appears and we wait afterwards
        for (let i = 1; i <= text.length; i++) {
            if (isCancelled) return;
            setLine2(text.slice(0, i));
            
            // Speed logic
            let delay = speed === 'fast' ? randomSpeed(50, 90) : randomSpeed(150, 200);
            if (speed === 'heavy' && i === text.length) delay = 0; // Instant impact on last char
            
            await wait(delay);
        }
        setIsTyping(false);
    };

    // Helper: Delete string
    const deleteString = async (text: string) => {
        setIsTyping(true);
        // Initial pause before deleting usually feels more natural
        await wait(300);

        for (let i = text.length - 1; i >= 0; i--) {
            if (isCancelled) return;
            setLine2(text.slice(0, i));
            await wait(30); // Fast consistent backspace
        }
        setIsTyping(false);
    };

    const runSequence = async () => {
        // 1. Initial Pause
        await wait(1000);

        // 2. Type "VAN NU" (Fast)
        await typeString("VAN NU", 'fast');
        await wait(800);

        // 3. Delete
        await deleteString("VAN NU");
        await wait(200);

        // 4. Type "MET KARAKTER" (Fast)
        await typeString("MET KARAKTER", 'fast');
        await wait(800);

        // 5. Delete
        await deleteString("MET KARAKTER");
        await wait(300);

        // 6. Type "MET IMPACT" (Heavy/Slow)
        await typeString("MET IMPACT", 'heavy');
        
        // 7. FINALE
        setIsImpact(true);
    };

    runSequence();

    return () => { isCancelled = true; };
  }, []);

  // Mouse position logic for the reveal image
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the image movement
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // 3D Tilt Transforms based on screen position
  const rotateX = useTransform(y, [0, 1000], [10, -10]);
  const rotateY = useTransform(x, [0, 1500], [-10, 10]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section aria-label="Wamelink Webdesign" className="relative min-h-screen flex flex-col justify-center py-32 overflow-hidden border-b border-black bg-white">
      
      {/* Floating Reveal Image with 3D Tilt */}
      <motion.div
        style={{ 
          x, 
          y,
          rotateX, 
          rotateY,
          perspective: 1000
        }}
        className="fixed top-0 left-0 w-[300px] h-[400px] pointer-events-none z-50 rounded-2xl overflow-hidden border-2 border-black hidden md:block shadow-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isHovering ? 1 : 0, 
          scale: isHovering ? 1 : 0.8,
        }}
        transition={{ duration: 0.4, ease: "backOut" }}
      >
        <img 
          src="https://storage.googleapis.com/wamelinkwebdesign/7C0A657F-B062-40E3-8E57-5F023AB1467F-scaled-e1728132677727-uai-1092x1365.jpg" 
          alt="Dennis Wamelink" 
          className="w-full h-full object-cover bg-gray-200"
        />
      </motion.div>

      {/* Rotating Badge */}
      <motion.div
        className="absolute top-32 right-8 md:right-32 z-10 hidden md:block"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full absolute top-0 left-0">
            <path id="curve" d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0" fill="transparent" />
            <text className="text-[11px] font-bold uppercase tracking-[0.2em]">
              <textPath href="#curve">
               Design • Develop • Launch •
              </textPath>
            </text>
          </svg>
          <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-2xl font-black tracking-tighter">W</span>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 sm:px-8 relative z-20">
        <div className="flex flex-col gap-12 items-center">
          
          {/* Main Headline */}
          <div className="w-full flex justify-center">
            <h1 className="text-[12vw] leading-[0.85] font-black tracking-tighter uppercase flex flex-col items-start text-left w-fit select-none">
              
              {/* Line 1 - Split for consistent spacing on mobile */}
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-black block"
              >
                MAATWERK
              </motion.span>

              {/* Line 2 */}
               <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-black block"
              >
                WEBSITES
              </motion.span>
              
              {/* Line 3 with effect */}
              <span 
                className="relative inline-block cursor-default group w-max max-w-full min-h-[0.8em]"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {/* 
                    Logic:
                    If !isImpact: Text is transparent with Stroke.
                    If isImpact: Text becomes solid Black.
                */}
                <span 
                    className={`inline-block transition-all duration-300 ${
                        isImpact 
                        ? "text-black" 
                        : "text-transparent [-webkit-text-stroke:1px_black] md:[-webkit-text-stroke:2px_black]"
                    }`}
                >
                    {line2}
                </span>

                {/* Cursor */}
                {showCursor && (
                   <>
                     {/* Blinking logic: Blinks normally (!isImpact & !isTyping), stops blinking and becomes solid when Impact (isDot=true) or Typing */}
                     <Cursor blinking={!isImpact && !isTyping} isDot={isImpact} />
                   </>
                )}
              </span>
            </h1>
          </div>
          
          {/* Bottom Row: Subhead & CTA */}
          <div className="w-full flex flex-col md:flex-row justify-center md:justify-between items-end gap-8 border-t border-black pt-8">
            <div className="hidden md:block">
              <MagneticButton
                href="https://calendar.app.google/DZwS3JYfBFnzHn566"
                target="_blank"
                className="bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-[#FFD700] hover:text-black transition-colors flex items-center justify-center"
              >
                Plan een gesprek
              </MagneticButton>
            </div>

            <motion.div 
              className="w-full md:w-auto md:text-right max-w-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }} 
            >
               <p
                 className="text-xl md:text-2xl font-bold leading-tight cursor-pointer hover:underline decoration-2 underline-offset-4 decoration-[#FFD700]"
                 onMouseEnter={() => setIsHovering(true)}
                 onMouseLeave={() => setIsHovering(false)}
               >
                 <b>digital designer & developer</b><br /><i>based in AMS</i>
               </p>
               
               {/* Mobile CTA */}
               <div className="mt-8 md:hidden w-full">
                <MagneticButton
                  href="https://calendar.app.google/DZwS3JYfBFnzHn566"
                  target="_blank"
                  className="bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-[#FFD700] hover:text-black transition-colors w-full flex justify-center"
                >
                  Plan een gesprek
                </MagneticButton>
               </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-8 left-0 w-full flex justify-center items-center gap-2 z-20 cursor-pointer"
        onClick={scrollToServices}
      >
        <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Scroll Down</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <ArrowDown size={16} />
            </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;