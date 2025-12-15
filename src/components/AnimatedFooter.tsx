import { motion } from 'framer-motion';

export const AnimatedFooter = () => {
  return (
    <motion.footer
      className="absolute bottom-0 left-0 right-0 z-10 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 2 }}
    >
      <motion.div
        className="glass-card py-4 px-8 mx-auto w-fit"
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <p className="text-sm text-muted-foreground text-center flex items-center gap-2 justify-center flex-wrap">
          <span>Made with</span>
          <motion.span
            className="text-destructive"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ❤️
          </motion.span>
          <motion.span
            className="gradient-text font-bold text-lg"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            ∞
          </motion.span>
          <span className="gradient-text font-semibold tracking-wide">
            INFINITE LOOPERS
          </span>
          <span className="text-muted-foreground/60">|</span>
          <span>Hackathon 2025</span>
        </p>
      </motion.div>

      {/* Emotional tagline */}
      <motion.p
        className="text-center text-sm text-muted-foreground/70 mt-4 italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        "Every item has a story. Every finder brings someone hope."
      </motion.p>
    </motion.footer>
  );
};
