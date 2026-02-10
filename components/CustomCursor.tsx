import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isOnDarkBg, setIsOnDarkBg] = useState(true);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Check if cursor is over a dark or light background
      const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
      if (elementBelow) {
        const bg = window.getComputedStyle(elementBelow).backgroundColor;
        const match = bg.match(/\d+/g);
        if (match) {
          const [r, g, b] = match.map(Number);
          // Luminance check: dark if below 128
          const luminance = (r * 299 + g * 587 + b * 114) / 1000;
          setIsOnDarkBg(luminance < 128);
        }
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' ||
        target.closest('a') || 
        target.closest('button') ||
        target.closest('.cursor-hover');
        
      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  const cursorColor = isOnDarkBg ? 'white' : 'black';

  return (
    <>
      <motion.div
        className="hidden md:block fixed top-0 left-0 w-3 h-3 rounded-full pointer-events-none z-[9999]"
        style={{ backgroundColor: cursorColor }}
        animate={{ x: mousePosition.x - 6, y: mousePosition.y - 6 }}
        transition={{ type: 'tween', ease: 'linear', duration: 0 }}
      />
      <motion.div
        className="hidden md:block fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999]"
        style={{ borderColor: cursorColor, borderWidth: isHovering ? '1px' : '2px', borderStyle: 'solid' }}
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 2.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      />
    </>
  );
};

export default CustomCursor;
