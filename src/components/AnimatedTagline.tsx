import { motion } from 'framer-motion';

const words = [
  { text: 'Lose it.', className: 'text-foreground' },
  { text: 'Find it.', className: 'gradient-text' },
  { text: 'Claim it.', className: 'text-foreground' },
];

export const AnimatedTagline = () => {
  return (
    <motion.h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 max-w-4xl leading-tight">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className={word.className}
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.6,
            delay: 0.3 + i * 0.3,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {word.text}{' '}
        </motion.span>
      ))}
    </motion.h1>
  );
};
