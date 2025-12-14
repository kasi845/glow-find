import { motion } from 'framer-motion';
import { Package, Search } from 'lucide-react';

interface EmptyStateProps {
  type?: 'notifications' | 'messages' | 'items';
  title: string;
  description: string;
}

export const EmptyState = ({ type = 'notifications', title, description }: EmptyStateProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center px-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* 3D-style illustration */}
      <motion.div
        className="relative mb-8"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-32 h-32 rounded-3xl gradient-bg opacity-20 blur-xl absolute inset-0" />
        <div className="relative w-32 h-32 glass-card rounded-3xl flex items-center justify-center">
          {type === 'notifications' ? (
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <Package className="text-primary" size={48} />
            </motion.div>
          ) : (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Search className="text-primary" size={48} />
            </motion.div>
          )}
        </div>
        
        {/* Floating particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/40"
            style={{
              top: `${20 + i * 30}%`,
              left: `${10 + i * 40}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.div>

      <motion.h2
        className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.h2>
      <motion.p
        className="text-muted-foreground text-base md:text-lg max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
};
