import { motion } from 'framer-motion';

export const FloatingOrbs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary Orb - Orange */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, hsl(25 95% 60%) 0%, transparent 70%)',
          top: '10%',
          left: '10%',
        }}
        animate={{
          x: [0, 100, 50, 0],
          y: [0, 50, 100, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Secondary Orb - Pink */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, hsl(320 80% 55%) 0%, transparent 70%)',
          top: '50%',
          right: '15%',
        }}
        animate={{
          x: [0, -80, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 0.8, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Accent Orb - Purple */}
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full opacity-15 blur-[80px]"
        style={{
          background: 'radial-gradient(circle, hsl(280 70% 50%) 0%, transparent 70%)',
          bottom: '20%',
          left: '30%',
        }}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -40, 60, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};
