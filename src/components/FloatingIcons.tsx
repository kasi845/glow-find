import { motion } from 'framer-motion';
import { Wallet, Key, Smartphone, Briefcase, Watch, Headphones, Camera, Glasses } from 'lucide-react';

const icons = [
  { Icon: Wallet, delay: 0, x: '10%', y: '20%' },
  { Icon: Key, delay: 0.5, x: '80%', y: '15%' },
  { Icon: Smartphone, delay: 1, x: '15%', y: '70%' },
  { Icon: Briefcase, delay: 1.5, x: '85%', y: '65%' },
  { Icon: Watch, delay: 2, x: '50%', y: '10%' },
  { Icon: Headphones, delay: 2.5, x: '25%', y: '45%' },
  { Icon: Camera, delay: 3, x: '70%', y: '40%' },
  { Icon: Glasses, delay: 3.5, x: '90%', y: '85%' },
];

export const FloatingIcons = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {icons.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          className="absolute text-primary/20"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 6,
            delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Icon size={40} />
        </motion.div>
      ))}
    </div>
  );
};
