import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export const AlertBanner = () => {
  return (
    <motion.div
      className="glass-card p-4 flex items-center gap-3 border-l-4 border-primary"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <AlertTriangle className="text-primary" size={24} />
      </motion.div>
      <p className="text-muted-foreground">
        <span className="text-foreground font-medium">Stay alert!</span> Found something? Report it fast.
      </p>
    </motion.div>
  );
};
