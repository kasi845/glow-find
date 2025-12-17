import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export const AuroraBackground = () => {
  const [animateOrbs, setAnimateOrbs] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for mobile and reduced motion
    setIsMobile(window.innerWidth < 768);
    setPrefersReducedMotion(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    // Stop orb animations after 4 seconds
    const timer = setTimeout(() => setAnimateOrbs(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Minimal background for mobile or reduced motion
  if (isMobile || prefersReducedMotion) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
        {/* Static orbs without animation */}
        <div
          className="absolute w-56 h-56 rounded-full blur-xl opacity-15"
          style={{
            background: 'radial-gradient(circle, hsl(25 95% 60% / 0.2) 0%, transparent 70%)',
            top: '10%',
            left: '10%',
          }}
        />
        <div
          className="absolute w-48 h-48 rounded-full blur-xl opacity-12"
          style={{
            background: 'radial-gradient(circle, hsl(320 80% 55% / 0.18) 0%, transparent 70%)',
            top: '50%',
            right: '15%',
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
      
      {/* Aurora layer - runs once then stops */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(45deg, hsl(25 95% 60% / 0.15), transparent 50%, hsl(320 80% 55% / 0.15))',
        }}
        initial={{
          background: 'linear-gradient(45deg, hsl(25 95% 60% / 0.15), transparent 50%, hsl(320 80% 55% / 0.15))',
        }}
        animate={{
          background: 'linear-gradient(135deg, hsl(280 70% 50% / 0.15), transparent 50%, hsl(25 95% 60% / 0.15))',
        }}
        transition={{ duration: 4, ease: 'easeInOut' }}
      />

      {/* Floating orbs - reduced blur, stop after animation */}
      <motion.div
        className="absolute w-56 h-56 rounded-full blur-xl"
        style={{
          background: 'radial-gradient(circle, hsl(25 95% 60% / 0.2) 0%, transparent 70%)',
          top: '5%',
          left: '5%',
        }}
        initial={{ x: 0, y: 0, scale: 1, opacity: 0 }}
        animate={animateOrbs 
          ? { x: 60, y: 40, scale: 1.1, opacity: 0.2 }
          : { x: 60, y: 40, scale: 1.1, opacity: 0.2 }
        }
        transition={{ duration: 3, ease: 'easeOut' }}
      />

      <motion.div
        className="absolute w-48 h-48 rounded-full blur-xl"
        style={{
          background: 'radial-gradient(circle, hsl(320 80% 55% / 0.18) 0%, transparent 70%)',
          top: '40%',
          right: '10%',
        }}
        initial={{ x: 0, y: 0, scale: 1, opacity: 0 }}
        animate={animateOrbs 
          ? { x: -50, y: -30, scale: 1.05, opacity: 0.18 }
          : { x: -50, y: -30, scale: 1.05, opacity: 0.18 }
        }
        transition={{ duration: 3.5, ease: 'easeOut' }}
      />

      <motion.div
        className="absolute w-44 h-44 rounded-full blur-lg"
        style={{
          background: 'radial-gradient(circle, hsl(280 70% 50% / 0.15) 0%, transparent 70%)',
          bottom: '15%',
          left: '25%',
        }}
        initial={{ x: 0, y: 0, scale: 1, opacity: 0 }}
        animate={animateOrbs 
          ? { x: 40, y: -25, scale: 1.08, opacity: 0.15 }
          : { x: 40, y: -25, scale: 1.08, opacity: 0.15 }
        }
        transition={{ duration: 3.2, ease: 'easeOut' }}
      />

      {/* Light streaks - single animation */}
      <motion.div
        className="absolute w-[2px] h-[150px]"
        style={{
          background: 'linear-gradient(to bottom, transparent, hsl(320 80% 55%), transparent)',
          top: '20%',
          left: '30%',
          transform: 'rotate(45deg)',
        }}
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 0.1, y: 30 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      />

      <motion.div
        className="absolute w-[2px] h-[120px]"
        style={{
          background: 'linear-gradient(to bottom, transparent, hsl(25 95% 60%), transparent)',
          top: '50%',
          right: '25%',
          transform: 'rotate(-30deg)',
        }}
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 0.12, y: -20 }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
      />
    </div>
  );
};
