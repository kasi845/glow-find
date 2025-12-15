import { motion } from 'framer-motion';

export const CinematicHero = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
      className="flex flex-col items-center justify-center text-center space-y-6 px-6"
    >
      {/* Main Headline */}
      <motion.h1
        className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-tight max-w-5xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
      >
        <motion.span
          className="inline-block"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Where what's lost
        </motion.span>
        <br />
        <motion.span
          className="inline-block gradient-text"
          initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.9 }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          style={{
            textShadow: '0 0 30px hsl(320 80% 55% / 0.5), 0 0 60px hsl(25 95% 60% / 0.3)',
          }}
        >
          finds its way home.
        </motion.span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-lg md:text-xl text-muted-foreground max-w-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        Reuniting people with their belongings — powered by AI, trust, and care.
      </motion.p>

      {/* Decorative line */}
      <motion.div
        className="w-24 h-1 rounded-full gradient-bg"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.8 }}
      />
    </motion.div>
  );
};
