import { motion } from 'framer-motion';

export const AuroraBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
      
      {/* Aurora layers */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(45deg, hsl(25 95% 60% / 0.15), transparent 50%, hsl(320 80% 55% / 0.15))',
        }}
        animate={{
          background: [
            'linear-gradient(45deg, hsl(25 95% 60% / 0.15), transparent 50%, hsl(320 80% 55% / 0.15))',
            'linear-gradient(90deg, hsl(320 80% 55% / 0.15), transparent 50%, hsl(280 70% 50% / 0.15))',
            'linear-gradient(135deg, hsl(280 70% 50% / 0.15), transparent 50%, hsl(25 95% 60% / 0.15))',
            'linear-gradient(45deg, hsl(25 95% 60% / 0.15), transparent 50%, hsl(320 80% 55% / 0.15))',
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating orbs with depth */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[150px]"
        style={{
          background: 'radial-gradient(circle, hsl(25 95% 60% / 0.2) 0%, transparent 70%)',
          top: '5%',
          left: '5%',
        }}
        animate={{
          x: [0, 120, 60, 0],
          y: [0, 80, 120, 0],
          scale: [1, 1.3, 0.9, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{
          background: 'radial-gradient(circle, hsl(320 80% 55% / 0.18) 0%, transparent 70%)',
          top: '40%',
          right: '10%',
        }}
        animate={{
          x: [0, -100, -50, 0],
          y: [0, -80, 60, 0],
          scale: [1, 0.85, 1.15, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full blur-[100px]"
        style={{
          background: 'radial-gradient(circle, hsl(280 70% 50% / 0.15) 0%, transparent 70%)',
          bottom: '15%',
          left: '25%',
        }}
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -50, 80, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Light streaks */}
      <motion.div
        className="absolute w-[2px] h-[200px] opacity-10"
        style={{
          background: 'linear-gradient(to bottom, transparent, hsl(320 80% 55%), transparent)',
          top: '20%',
          left: '30%',
          transform: 'rotate(45deg)',
        }}
        animate={{ opacity: [0.05, 0.15, 0.05], y: [0, 50, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute w-[2px] h-[150px] opacity-10"
        style={{
          background: 'linear-gradient(to bottom, transparent, hsl(25 95% 60%), transparent)',
          top: '50%',
          right: '25%',
          transform: 'rotate(-30deg)',
        }}
        animate={{ opacity: [0.08, 0.2, 0.08], y: [0, -30, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Particle dust */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/20"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0],
            y: [0, -30, -60],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};
